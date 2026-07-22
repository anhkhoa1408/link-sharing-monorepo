import { Platform } from '../../../generated/prisma/enums';
import { AuthenticatedPrincipal } from '../../auth/strategies/jwt.strategy';

export interface AuthenticatedRequest {
  user: AuthenticatedPrincipal;
}

export interface LinkData {
  platform: Platform;
  url: string;
}
