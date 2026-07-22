import { User } from '@supabase/supabase-js';

export interface RegisterResponseDto {
  user: User;
  requiresEmailConfirmation: true;
}

export interface LoginResponseDto {
  user: User;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt?: number;
}
