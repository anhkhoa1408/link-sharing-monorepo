import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  SUPABASE_AUTH_CLIENT,
  SUPABASE_CLIENT,
} from './supabase.constants';

const HEALTH_TIMEOUT_MS = 3_000;

@Injectable()
export class SupabaseService {
  constructor(
    @Inject(SUPABASE_AUTH_CLIENT)
    private readonly authClient: SupabaseClient,
    @Inject(SUPABASE_CLIENT) private readonly client: SupabaseClient,
  ) {}

  get auth(): SupabaseClient['auth'] {
    return this.authClient.auth;
  }

  get authAdmin(): SupabaseClient['auth']['admin'] {
    return this.client.auth.admin;
  }

  get storage(): SupabaseClient['storage'] {
    return this.client.storage;
  }

  async checkConnection(): Promise<void> {
    let timer: ReturnType<typeof setTimeout> | undefined;

    try {
      const result = await Promise.race([
        this.client.auth.admin.listUsers({ page: 1, perPage: 1 }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new Error('Supabase health check timed out')),
            HEALTH_TIMEOUT_MS,
          );
        }),
      ]);

      if (result.error) {
        throw result.error;
      }
    } catch {
      throw new Error('Supabase unavailable');
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
}
