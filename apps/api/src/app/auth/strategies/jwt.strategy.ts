import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '@supabase/supabase-js';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { SupabaseService } from '../../supabase/supabase.service';
import {
  assertAuthProviderAvailable,
  callAuthProvider,
} from '../auth-provider.errors';

export interface AuthenticatedPrincipal {
  accessToken: string;
  claims: JwtPayload;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly supabase: SupabaseService) {
    super();
  }

  async validate(request: Request): Promise<AuthenticatedPrincipal> {
    const authorization = request.headers.authorization;
    const match = authorization?.match(/^Bearer (\S+)$/i);

    if (!match?.[1]) {
      throw new UnauthorizedException('Missing bearer access token');
    }

    const accessToken = match[1];
    const { data, error } = await callAuthProvider(() =>
      this.supabase.auth.getClaims(accessToken),
    );
    assertAuthProviderAvailable(error);

    if (error || !data?.claims) {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return { accessToken, claims: data.claims };
  }
}
