import type { UpdateProfile } from '@link-sharing/shared-models';
import type { AuthenticatedPrincipal } from '../../auth/strategies/jwt.strategy';

export interface AuthenticatedRequest {
  user: AuthenticatedPrincipal;
}

export type ProfileData = UpdateProfile;
