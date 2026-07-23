import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  email,
  form,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from '../../api/auth-api.service';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';
import { AuthTemplateComponent } from '../../templates/auth-template/auth-template.component';

interface RegisterFormModel {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthTemplateComponent, ButtonComponent, InputComponent, RouterLink],
  selector: 'app-register',
  styles: `
    :host {
      .register {
        &__message,
        &__login {
          margin: 0;
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

        &__login {
          color: var(--color-grey-500);
          font-size: var(--font-size-16);
          font-weight: var(--font-weight-regular);
          line-height: var(--line-height-150);
          text-align: center;
        }

        &__login-action {
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
        .register {
          &__login {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  `,
  template: `
    <app-auth-template
      description="Let’s get you started sharing your links!"
      title="Create account"
    >
      @if (isRegistered()) {
        <p class="register__message register__message--success" role="status">
          Check your email to confirm your account.
        </p>
      } @else {
        <form class="register__form" novalidate (submit)="onSubmit($event)">
          <label class="register__field" for="register-email">
            <span class="register__label">Email address</span>
            <app-input
              ariaLabel="Email address"
              icon="email"
              inputId="register-email"
              placeholder="e.g. alex@email.com"
              type="email"
              [errorMessage]="emailErrorMessage()"
              [formField]="registerForm.email"
              [isError]="showEmailError()"
            />
          </label>

          <label class="register__field" for="register-password">
            <span class="register__label">Create password</span>
            <app-input
              ariaLabel="Create password"
              icon="password"
              inputId="register-password"
              placeholder="At least 8 characters"
              type="password"
              [errorMessage]="passwordErrorMessage()"
              [formField]="registerForm.password"
              [isError]="showPasswordError()"
            />
          </label>

          <label class="register__field" for="register-confirm-password">
            <span class="register__label">Confirm password</span>
            <app-input
              ariaLabel="Confirm password"
              icon="password"
              inputId="register-confirm-password"
              placeholder="At least 8 characters"
              type="password"
              [errorMessage]="confirmPasswordErrorMessage()"
              [formField]="registerForm.confirmPassword"
              [isError]="showConfirmPasswordError()"
            />
          </label>

          @if (errorMessage()) {
            <p class="register__message register__message--error" role="alert">
              {{ errorMessage() }}
            </p>
          }

          <app-button type="submit" [disabled]="isSubmitting()">
            {{ isSubmitting() ? 'Creating account…' : 'Create new account' }}
          </app-button>

          <p class="register__login">
            Already have an account?
            <a class="register__login-action" routerLink="/login">Login</a>
          </p>
        </form>
      }
    </app-auth-template>
  `,
})
export class RegisterComponent {
  private readonly authApi = inject(AuthApiService);
  private readonly model = signal<RegisterFormModel>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  private readonly hasSubmitted = signal(false);

  public readonly registerForm = form(this.model, (path) => {
    required(path.email, { message: 'Email is required' });
    email(path.email, { message: 'Enter a valid email address' });
    required(path.password, { message: 'Password is required' });
    minLength(path.password, 8, {
      message: 'Password must be at least 8 characters',
    });
    required(path.confirmPassword, { message: 'Confirm your password' });
    validate(path.confirmPassword, ({ value, valueOf }) =>
      value() !== valueOf(path.password)
        ? { kind: 'passwordMismatch', message: 'Passwords do not match' }
        : undefined,
    );
  });
  public readonly errorMessage = signal('');
  public readonly isRegistered = signal(false);
  public readonly isSubmitting = computed(() =>
    this.registerForm().submitting(),
  );
  public readonly showEmailError = computed(
    () =>
      this.registerForm.email().invalid() &&
      (this.registerForm.email().touched() || this.hasSubmitted()),
  );
  public readonly showPasswordError = computed(
    () =>
      this.registerForm.password().invalid() &&
      (this.registerForm.password().touched() || this.hasSubmitted()),
  );
  public readonly showConfirmPasswordError = computed(
    () =>
      this.registerForm.confirmPassword().invalid() &&
      (this.registerForm.confirmPassword().touched() || this.hasSubmitted()),
  );
  public readonly emailErrorMessage = computed(
    () => this.registerForm.email().errors()[0]?.message ?? '',
  );
  public readonly passwordErrorMessage = computed(
    () => this.registerForm.password().errors()[0]?.message ?? '',
  );
  public readonly confirmPasswordErrorMessage = computed(
    () => this.registerForm.confirmPassword().errors()[0]?.message ?? '',
  );

  public onSubmit(event: Event): void {
    event.preventDefault();
    this.hasSubmitted.set(true);
    this.errorMessage.set('');
    void this.submitRegistration();
  }

  private async submitRegistration(): Promise<void> {
    await submit(this.registerForm, async (submittedForm) => {
      const { email, password } = submittedForm().value();

      try {
        await firstValueFrom(this.authApi.register({ email, password }));
        this.isRegistered.set(true);
      } catch (error: unknown) {
        this.errorMessage.set(
          error instanceof HttpErrorResponse && error.status === 400
            ? 'Unable to create account.'
            : 'Unable to register. Please try again.',
        );
      }
    });
  }
}
