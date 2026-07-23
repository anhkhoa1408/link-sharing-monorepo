import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import type { AuthCredentials } from '@link-sharing/shared-models';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from '../../../api/auth-api.service';
import { AuthService } from '../../../core/auth.service';

@Injectable()
export class LoginFacadeService {
  private readonly authApi = inject(AuthApiService);
  private readonly auth = inject(AuthService);
  private readonly errorMessageState = signal('');

  public readonly errorMessage = this.errorMessageState.asReadonly();

  public async login(credentials: AuthCredentials): Promise<boolean> {
    this.clearError();

    try {
      const session = await firstValueFrom(this.authApi.login(credentials));

      if (!this.auth.save(session)) {
        throw new Error('The API returned an expired access token.');
      }

      return true;
    } catch (error: unknown) {
      this.errorMessageState.set(
        error instanceof HttpErrorResponse && error.status === 401
          ? 'Invalid email or password'
          : 'Unable to log in. Please try again.',
      );
      return false;
    }
  }

  public clearError(): void {
    this.errorMessageState.set('');
  }

  public setError(message: string): void {
    this.errorMessageState.set(message);
  }
}
