import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import type { AuthCredentials } from '@link-sharing/shared-models';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from '../../../api/auth-api.service';

@Injectable()
export class RegisterFacadeService {
  private readonly authApi = inject(AuthApiService);
  private readonly errorMessageState = signal('');
  private readonly isRegisteredState = signal(false);

  public readonly errorMessage = this.errorMessageState.asReadonly();
  public readonly isRegistered = this.isRegisteredState.asReadonly();

  public async register(credentials: AuthCredentials): Promise<void> {
    this.clearError();

    try {
      await firstValueFrom(this.authApi.register(credentials));
      this.isRegisteredState.set(true);
    } catch (error: unknown) {
      this.errorMessageState.set(
        error instanceof HttpErrorResponse && error.status === 400
          ? 'Unable to create account.'
          : 'Unable to register. Please try again.',
      );
    }
  }

  public clearError(): void {
    this.errorMessageState.set('');
  }
}
