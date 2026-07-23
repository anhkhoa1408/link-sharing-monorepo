import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase.service';
import {
  assertAuthProviderAvailable,
  callAuthProvider,
} from './auth-provider.errors';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async register(
    credentials: AuthCredentialsDto,
  ): Promise<RegisterResponseDto> {
    const { data, error } = await callAuthProvider(() =>
      this.supabase.auth.signUp(credentials),
    );
    assertAuthProviderAvailable(error);

    if (error || !data.user) {
      throw new BadRequestException('Unable to register');
    }

    return {
      user: data.user,
      requiresEmailConfirmation: true,
    };
  }

  async login(credentials: AuthCredentialsDto): Promise<LoginResponseDto> {
    const { data, error } = await callAuthProvider(() =>
      this.supabase.auth.signInWithPassword(credentials),
    );
    assertAuthProviderAvailable(error);

    if (error || !data.user || !data.session) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      user: data.user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      tokenType: data.session.token_type,
      expiresIn: data.session.expires_in,
      expiresAt: data.session.expires_at,
    };
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const { data, error } = await callAuthProvider(() =>
      this.supabase.auth.getUser(accessToken),
    );
    assertAuthProviderAvailable(error);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return data.user;
  }

  async getById(userId: string): Promise<User> {
    const { data, error } = await callAuthProvider(() =>
      this.supabase.authAdmin.getUserById(userId),
    );
    assertAuthProviderAvailable(error);

    if (error || !data.user) {
      throw new NotFoundException('User not found');
    }

    return data.user;
  }
}
