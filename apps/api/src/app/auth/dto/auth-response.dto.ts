import { User } from '@supabase/supabase-js';
import type { LoginResponse } from '@link-sharing/shared-models';

export interface RegisterResponseDto {
  user: User;
  requiresEmailConfirmation: true;
}

export type LoginResponseDto = LoginResponse;
