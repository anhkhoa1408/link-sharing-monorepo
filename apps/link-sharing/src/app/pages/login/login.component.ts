import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
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
import { AuthSessionService } from '../../auth/auth-session.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, InputComponent, NgOptimizedImage],
  selector: 'app-login',
  styles: `
    :host {
      display: block;
      min-height: 100dvh;

      .login {
        display: grid;
        min-height: 100dvh;
        padding: var(--spacing-500) var(--spacing-300);
        place-items: center;
        background: var(--color-grey-50);

        &__container {
          display: flex;
          width: min(100%, 476px);
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-600);
        }

        &__logo {
          width: 183px;
          height: 40px;
        }

        &__card {
          display: flex;
          width: 100%;
          flex-direction: column;
          gap: var(--spacing-500);
          padding: var(--spacing-500);
          border-radius: 12px;
          background: var(--color-white);
        }

        &__header {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-100);
        }

        &__title,
        &__description,
        &__message,
        &__register {
          margin: 0;
        }

        &__title {
          color: var(--color-grey-900);
          font-size: var(--font-size-32);
          font-weight: var(--font-weight-bold);
          line-height: var(--line-height-150);
        }

        &__description,
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
        }
      }

      @media (width < 600px) {
        .login {
          padding: var(--spacing-400) var(--spacing-300);
          place-items: start center;

          &__container {
            align-items: flex-start;
            gap: var(--spacing-600);
          }

          &__card {
            gap: var(--spacing-500);
            padding: 0;
            background: transparent;
          }

          &__title {
            font-size: var(--font-size-24);
          }

          &__register {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  `,
  template: `
    <main class="login">
      <div class="login__container">
        <img
          alt="Devlinks"
          class="login__logo"
          height="40"
          ngSrc="images/logo-devlinks-large.svg"
          priority
          width="183"
        />

        <section class="login__card" aria-labelledby="login-title">
          <header class="login__header">
            <h1 class="login__title" id="login-title">Login</h1>
            <p class="login__description">
              Add your details below to get back into the app
            </p>
          </header>

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
              <span class="login__register-action">Create account</span>
            </p>
          </form>
        </section>
      </div>
    </main>
  `,
})
export class LoginComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
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
        this.authSession.save(session);
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
