import { inject, Injectable } from '@angular/core';
import type { LoginResponse } from '@link-sharing/shared-models';
import { StorageKey } from './constants/storage-key.constant';
import { LocalStorageService } from './services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(LocalStorageService);

  public save(session: LoginResponse): boolean {
    return this.saveAccessToken(session.accessToken);
  }

  public saveAccessToken(accessToken: string): boolean {
    if (!this.isAccessTokenValid(accessToken)) {
      this.storage.delete(StorageKey.ACCESS_TOKEN);
      return false;
    }

    this.storage.set(StorageKey.ACCESS_TOKEN, accessToken);
    return true;
  }

  public isAuthenticated(): boolean {
    let accessToken: unknown;

    try {
      accessToken = this.storage.get<unknown>(StorageKey.ACCESS_TOKEN);
    } catch {
      this.storage.delete(StorageKey.ACCESS_TOKEN);
      return false;
    }

    if (
      typeof accessToken !== 'string' ||
      !this.isAccessTokenValid(accessToken)
    ) {
      this.storage.delete(StorageKey.ACCESS_TOKEN);
      return false;
    }

    return true;
  }

  private isAccessTokenValid(accessToken: string): boolean {
    const expiresAt = this.getExpiresAt(accessToken);

    return expiresAt !== null && expiresAt > Date.now() / 1000;
  }

  private getExpiresAt(accessToken: string): number | null {
    try {
      const segments = accessToken.split('.');

      if (segments.length !== 3 || !segments[1]) {
        return null;
      }

      const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '=',
      );
      const bytes = Uint8Array.from(atob(paddedBase64), (character) =>
        character.charCodeAt(0),
      );
      const payload = JSON.parse(new TextDecoder().decode(bytes)) as {
        exp?: unknown;
      };

      return typeof payload.exp === 'number' && Number.isFinite(payload.exp)
        ? payload.exp
        : null;
    } catch {
      return null;
    }
  }
}
