import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  email,
  form,
  minLength,
  required,
  submit,
} from '@angular/forms/signals';
import type { AuthCredentials } from '@link-sharing/shared-models';
import { firstValueFrom } from 'rxjs';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';
import { AuthApiService } from '../../api/auth-api.service';
import { AuthService } from '../../core/auth.service';
import { AuthTemplateComponent } from '../../templates/auth-template/auth-template.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthTemplateComponent, ButtonComponent, InputComponent, RouterLink],
  selector: 'app-login',
  styles: `
    :host {
      .login {
        &__message,
        &__register {
          margin: 0;
        }

        &__register {
          color: var(--color-grey-500);
          font-size: var(--font-size-16);
          font-weight: var(--font-weight-regular);
          line-height: var(--line-height-150);
        }

        &__form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-300);
        }

        &__field {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-100);
        }

        &__label,
        &__message {
          color: var(--color-grey-900);
          font-size: var(--font-size-12);
          font-weight: var(--font-weight-regular);
          line-height: var(--line-height-150);
        }

        &__message {
          padding: var(--spacing-100) var(--spacing-200);
          border-radius: 8px;

          &--error {
            background: rgb(255 57 57 / 10%);
            color: var(--color-red-500);
          }

          &--success {
            background: rgb(99 60 255 / 10%);
            color: var(--color-purple-600);
          }
        }

        &__register {
          text-align: center;
        }

        &__register-action {
          color: var(--color-purple-600);
          text-decoration: none;

          &:focus-visible {
            border-radius: 2px;
            outline: 2px solid var(--color-purple-600);
            outline-offset: 2px;
          }
        }
      }

      @media (width < 600px) {
        .login {
          &__register {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  `,
  template: `
    <app-auth-template
      description="Add your details below to get back into the app"
      title="Login"
    >
      <form class="login__form" novalidate (submit)="onSubmit($event)">
        <label class="login__field" for="login-email">
          <span class="login__label">Email address</span>
          <app-input
            ariaLabel="Email address"
            icon="email"
            inputId="login-email"
            placeholder="e.g. alex@email.com"
            type="email"
            [errorMessage]="emailErrorMessage()"
            [formField]="loginForm.email"
            [isError]="showEmailError()"
          />
        </label>

        <label class="login__field" for="login-password">
          <span class="login__label">Password</span>
          <app-input
            ariaLabel="Password"
            icon="password"
            inputId="login-password"
            placeholder="Enter your password"
            type="password"
            [errorMessage]="passwordErrorMessage()"
            [formField]="loginForm.password"
            [isError]="showPasswordError()"
          />
        </label>

        @if (errorMessage()) {
          <p class="login__message login__message--error" role="alert">
            {{ errorMessage() }}
          </p>
        }

        @if (successMessage()) {
          <p class="login__message login__message--success" role="status">
            {{ successMessage() }}
          </p>
        }

        <app-button type="submit" [disabled]="isSubmitting()">
          {{ isSubmitting() ? 'Logging in…' : 'Login' }}
        </app-button>

        <p class="login__register">
          Don’t have an account?
          <a class="login__register-action" routerLink="/register">
            Create account
          </a>
        </p>
      </form>
    </app-auth-template>
  `,
})
export class LoginComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly auth = inject(AuthService);
  private readonly credentials = signal<AuthCredentials>({
    email: '',
    password: '',
  });
  private readonly hasSubmitted = signal(false);

  public readonly loginForm = form(this.credentials, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, {
      message: 'Password must be at least 8 characters',
    });
  });
  public readonly errorMessage = signal('');
  public readonly successMessage = signal('');
  public readonly isSubmitting = computed(() => this.loginForm().submitting());
  public readonly showEmailError = computed(
    () =>
      this.loginForm.email().invalid() &&
      (this.loginForm.email().touched() || this.hasSubmitted()),
  );
  public readonly showPasswordError = computed(
    () =>
      this.loginForm.password().invalid() &&
      (this.loginForm.password().touched() || this.hasSubmitted()),
  );
  public readonly emailErrorMessage = computed(
    () => this.loginForm.email().errors()[0]?.message ?? '',
  );
  public readonly passwordErrorMessage = computed(
    () => this.loginForm.password().errors()[0]?.message ?? '',
  );

  public onSubmit(event: Event): void {
    event.preventDefault();
    this.hasSubmitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    void this.submitLogin();
  }

  private async submitLogin(): Promise<void> {
    await submit(this.loginForm, async (submittedForm) => {
      try {
        const session = await firstValueFrom(
          this.authApi.login(submittedForm().value()),
        );
        this.auth.save(session);
        this.successMessage.set('Login successful');
      } catch (error: unknown) {
        this.errorMessage.set(
          error instanceof HttpErrorResponse && error.status === 401
            ? 'Invalid email or password'
            : 'Unable to log in. Please try again.',
        );
      }
    });
  }
}
