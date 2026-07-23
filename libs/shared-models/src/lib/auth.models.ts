import type { User } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt?: number;
}

export interface RegisterResponse {
  user: User;
  requiresEmailConfirmation: true;
}
