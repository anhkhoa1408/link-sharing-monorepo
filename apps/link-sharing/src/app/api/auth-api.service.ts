import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  AuthCredentials,
  LoginResponse,
  RegisterResponse,
} from '@link-sharing/shared-models';
import type { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends BaseApiService {
  public constructor() {
    super(inject(HttpClient), '/api');
  }

  public login(credentials: AuthCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.endpoint('auth/login'),
      credentials,
    );
  }

  public register(credentials: AuthCredentials): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      this.endpoint('auth/register'),
      credentials,
    );
  }
}
