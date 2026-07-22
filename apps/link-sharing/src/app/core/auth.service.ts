import { inject, Injectable } from '@angular/core';
import type { LoginResponse } from '@link-sharing/shared-models';
import { StorageKey } from './constants/storage-key.constant';
import { LocalStorageService } from './services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(LocalStorageService);

  public save(session: LoginResponse): void {
    this.storage.set(StorageKey.ACCESS_TOKEN, session.accessToken);
  }
}
