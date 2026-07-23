import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  AuthCredentials,
  LoginResponse,
  RegisterResponse,
} from '@link-sharing/shared-models';
import type { User } from '@supabase/supabase-js';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends BaseApiService {
  public constructor() {
    super(inject(HttpClient), environment.baseApi);
  }

  public login(credentials: AuthCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.endpoint('auth/login'),
      credentials,
    );
  }

  public me(): Observable<User> {
    return this.http.get<User>(this.endpoint('auth/me'));
  }

  public register(credentials: AuthCredentials): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      this.endpoint('auth/register'),
      credentials,
    );
  }
}
