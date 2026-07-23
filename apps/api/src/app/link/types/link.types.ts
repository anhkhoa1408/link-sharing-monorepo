import type { Platform } from '@link-sharing/shared-models';
import { AuthenticatedPrincipal } from '../../auth/strategies/jwt.strategy';

export interface AuthenticatedRequest {
  user: AuthenticatedPrincipal;
}

export interface LinkData {
  platform: Platform;
  url: string;
}
