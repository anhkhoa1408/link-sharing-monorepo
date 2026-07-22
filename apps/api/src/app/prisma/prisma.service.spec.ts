import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  const config = {
    getOrThrow: vi
      .fn()
      .mockReturnValue('postgresql://user:password@localhost:6543/postgres'),
  } as unknown as ConfigService;

  it('checks the connection with a parameterized Prisma query', async () => {
    const service = new PrismaService(config);
    const query = vi.spyOn(service, '$queryRaw').mockResolvedValue([{ ok: 1 }]);

    await expect(service.checkConnection()).resolves.toBeUndefined();
    expect(query).toHaveBeenCalledOnce();
  });

  it('disconnects during module shutdown', async () => {
    const service = new PrismaService(config);
    const disconnect = vi
      .spyOn(service, '$disconnect')
      .mockResolvedValue(undefined);

    await service.onModuleDestroy();

    expect(disconnect).toHaveBeenCalledOnce();
  });
});
