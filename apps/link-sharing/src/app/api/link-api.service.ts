import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { SaveLink, UserLink } from '@link-sharing/shared-models';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseApiService } from './base-api.service';

@Injectable({ providedIn: 'root' })
export class LinkApiService extends BaseApiService {
  public constructor() {
    super(inject(HttpClient), environment.baseApi);
  }

  public getAll(): Observable<readonly UserLink[]> {
    return this.http.get<readonly UserLink[]>(
      this.endpoint('users/me/links'),
    );
  }

  public create(link: SaveLink): Observable<UserLink> {
    return this.http.post<UserLink>(this.endpoint('users/me/links'), link);
  }

  public update(id: string, link: SaveLink): Observable<UserLink> {
    return this.http.put<UserLink>(
      this.endpoint(`users/me/links/${id}`),
      link,
    );
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(
      this.endpoint(`users/me/links/${id}`),
    );
  }
}
