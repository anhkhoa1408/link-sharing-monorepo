import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { AvatarResponse } from '@link-sharing/shared-models';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AvatarApiService extends BaseApiService {
  public constructor() {
    super(inject(HttpClient), environment.baseApi);
  }

  public get(): Observable<AvatarResponse> {
    return this.http.get<AvatarResponse>(
      this.endpoint('users/me/avatar'),
    );
  }

  public upload(file: File): Observable<AvatarResponse> {
    const body = new FormData();
    body.append('avatar', file);

    return this.http.post<AvatarResponse>(
      this.endpoint('users/me/avatar'),
      body,
    );
  }
}
