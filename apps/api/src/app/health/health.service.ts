import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AppCacheService } from '../cache/app-cache.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';

const HEALTH_TIMEOUT_MS = 3_000;
type DependencyState = 'up' | 'down';

export interface HealthReport {
  status: 'ok' | 'error';
  dependencies: {
    database: DependencyState;
    redis: DependencyState;
    supabase: DependencyState;
  };
}

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: AppCacheService,
    private readonly supabase: SupabaseService,
  ) {}

  async check(): Promise<HealthReport> {
    const [database, redis, supabase] = await Promise.all([
      this.checkDependency(() => this.prisma.checkConnection()),
      this.checkDependency(() => this.cache.checkConnection()),
      this.checkDependency(() => this.supabase.checkConnection()),
    ]);
    const dependencies = { database, redis, supabase };

    if (Object.values(dependencies).includes('down')) {
      throw new ServiceUnavailableException({
        status: 'error',
        dependencies,
      } satisfies HealthReport);
    }

    return { status: 'ok', dependencies };
  }

  private async checkDependency(
    check: () => Promise<void>,
  ): Promise<DependencyState> {
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      await Promise.race([
        check(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('Dependency health check timed out')),
            HEALTH_TIMEOUT_MS,
          );
        }),
      ]);
      return 'up';
    } catch {
      return 'down';
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
