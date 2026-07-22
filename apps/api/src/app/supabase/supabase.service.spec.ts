import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

describe('SupabaseService', () => {
  const listUsers = vi.fn();
  const auth = { admin: { listUsers } };
  const storage = { from: vi.fn() };
  const client = { auth, storage } as unknown as SupabaseClient;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exposes Auth and Storage clients', () => {
    const service = new SupabaseService(client);

    expect(service.auth).toBe(auth);
    expect(service.storage).toBe(storage);
  });

  it('reports a successful Supabase connection', async () => {
    listUsers.mockResolvedValue({ data: { users: [] }, error: null });

    await expect(
      new SupabaseService(client).checkConnection(),
    ).resolves.toBeUndefined();
    expect(listUsers).toHaveBeenCalledWith({ page: 1, perPage: 1 });
  });

  it('sanitizes provider failures', async () => {
    listUsers.mockResolvedValue({
      data: null,
      error: new Error('provider payload with service-role-secret'),
    });

    await expect(new SupabaseService(client).checkConnection()).rejects.toThrow(
      'Supabase unavailable',
    );
    await expect(
      new SupabaseService(client).checkConnection(),
    ).rejects.not.toThrow('service-role-secret');
  });
});
