import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type {
  Profile,
  UpdateProfile,
} from '@link-sharing/shared-models';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class ProfileApiService extends BaseApiService {
  public constructor() {
    super(inject(HttpClient), environment.baseApi);
  }

  public get(): Observable<Profile> {
    return this.http.get<Profile>(this.endpoint('users/me/profile'));
  }

  public update(profile: UpdateProfile): Observable<Profile> {
    return this.http.put<Profile>(
      this.endpoint('users/me/profile'),
      profile,
    );
  }
}
