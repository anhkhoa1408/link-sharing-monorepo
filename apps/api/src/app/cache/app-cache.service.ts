import { randomUUID } from 'node:crypto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

const HEALTH_TIMEOUT_MS = 3_000;

@Injectable()
export class AppCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    await this.cache.set(key, value, ttlMs);
  }

  async delete(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async checkConnection(): Promise<void> {
    const key = `health:${randomUUID()}`;

    try {
      await this.withTimeout(this.cache.set(key, 'ok', HEALTH_TIMEOUT_MS));
      const value = await this.withTimeout(this.cache.get(key));
      await this.withTimeout(this.cache.del(key));

      if (value !== 'ok') throw new Error('Redis health value mismatch');
    } catch {
      throw new Error('Redis unavailable');
    }
  }

  private async withTimeout<T>(operation: Promise<T>): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      return await Promise.race([
        operation,
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('Redis health check timed out')),
            HEALTH_TIMEOUT_MS,
          );
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
