import { ServiceUnavailableException } from '@nestjs/common';
import { AuthError } from '@supabase/supabase-js';

const AUTH_SERVICE_UNAVAILABLE = 'Authentication service unavailable';

export async function callAuthProvider<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch {
    throw new ServiceUnavailableException(AUTH_SERVICE_UNAVAILABLE);
  }
}

export function assertAuthProviderAvailable(error: AuthError | null): void {
  if (
    error &&
    (error.status === undefined || error.status === 0 || error.status >= 500)
  ) {
    throw new ServiceUnavailableException(AUTH_SERVICE_UNAVAILABLE);
  }
}
