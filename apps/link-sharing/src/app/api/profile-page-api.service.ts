import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class ProfilePageApiService extends BaseApiService {
  public constructor() {
    super(inject(HttpClient), environment.baseApi);
  }

  public currentUrl(): string {
    return this.endpoint('users/me/profile-page');
  }

  public publicUrl(userId: string): string {
    return this.endpoint(`users/${encodeURIComponent(userId)}/profile-page`);
  }
}
