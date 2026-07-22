import { Cache } from 'cache-manager';
import { AppCacheService } from './app-cache.service';

describe('AppCacheService', () => {
  const cache = {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  } as unknown as Cache;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delegates typed cache operations and TTL', async () => {
    vi.mocked(cache.get).mockResolvedValue({ id: 1 });

    const service = new AppCacheService(cache);
    await expect(service.get<{ id: number }>('item')).resolves.toEqual({
      id: 1,
    });
    await service.set('item', { id: 1 }, 5_000);
    await service.delete('item');

    expect(cache.set).toHaveBeenCalledWith('item', { id: 1 }, 5_000);
    expect(cache.del).toHaveBeenCalledWith('item');
  });

  it('checks Redis with a short-lived round trip and cleans up', async () => {
    vi.mocked(cache.get).mockResolvedValue('ok');

    await expect(
      new AppCacheService(cache).checkConnection(),
    ).resolves.toBeUndefined();
    expect(cache.set).toHaveBeenCalledWith(
      expect.stringMatching(/^health:/),
      'ok',
      3_000,
    );
    expect(cache.del).toHaveBeenCalledWith(expect.stringMatching(/^health:/));
  });

  it('sanitizes Redis failures', async () => {
    vi.mocked(cache.set).mockRejectedValue(
      new Error('redis://user:secret@host:6379'),
    );

    await expect(new AppCacheService(cache).checkConnection()).rejects.toThrow(
      'Redis unavailable',
    );
    await expect(
      new AppCacheService(cache).checkConnection(),
    ).rejects.not.toThrow('secret');
  });
});
