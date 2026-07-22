import { ServiceUnavailableException } from '@nestjs/common';
import { AppCacheService } from '../cache/app-cache.service';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { HealthService } from './health.service';

describe('HealthService', () => {
  const prisma = { checkConnection: vi.fn() } as unknown as PrismaService;
  const cache = { checkConnection: vi.fn() } as unknown as AppCacheService;
  const supabase = { checkConnection: vi.fn() } as unknown as SupabaseService;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(prisma.checkConnection).mockResolvedValue(undefined);
    vi.mocked(cache.checkConnection).mockResolvedValue(undefined);
    vi.mocked(supabase.checkConnection).mockResolvedValue(undefined);
  });

  it('reports every dependency as healthy', async () => {
    await expect(
      new HealthService(prisma, cache, supabase).check(),
    ).resolves.toEqual({
      status: 'ok',
      dependencies: {
        database: 'up',
        redis: 'up',
        supabase: 'up',
      },
    });
  });

  it('throws 503 with sanitized dependency states', async () => {
    vi.mocked(cache.checkConnection).mockRejectedValue(
      new Error('redis://user:secret@host'),
    );

    const result = new HealthService(prisma, cache, supabase).check();
    const error = await result.catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ServiceUnavailableException);
    expect((error as ServiceUnavailableException).getResponse()).toEqual({
      status: 'error',
      dependencies: {
        database: 'up',
        redis: 'down',
        supabase: 'up',
      },
    });
    expect(JSON.stringify(error)).not.toContain('secret');
  });

  it('runs all dependency checks even when one fails', async () => {
    vi.mocked(prisma.checkConnection).mockRejectedValue(new Error('down'));

    await expect(
      new HealthService(prisma, cache, supabase).check(),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
    expect(cache.checkConnection).toHaveBeenCalledOnce();
    expect(supabase.checkConnection).toHaveBeenCalledOnce();
  });
});
