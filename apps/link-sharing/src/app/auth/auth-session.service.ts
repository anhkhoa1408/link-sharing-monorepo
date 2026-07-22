import { Injectable } from '@angular/core';
import type { LoginResponse } from '@link-sharing/shared-models';

const SESSION_STORAGE_KEY = 'link-sharing.session';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  public save(session: LoginResponse): void {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }
}
