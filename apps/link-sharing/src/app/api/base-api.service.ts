import { HttpClient } from '@angular/common/http';

export abstract class BaseApiService {
  protected constructor(
    protected readonly http: HttpClient,
    protected readonly baseUrl: string,
  ) {}

  protected endpoint(path: string): string {
    return `${this.baseUrl}/${path.replace(/^\//, '')}`;
  }
}
