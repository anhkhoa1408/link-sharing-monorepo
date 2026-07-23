import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  type OnDestroy,
  signal,
} from '@angular/core';
import {
  disabled,
  form,
  required,
  submit,
} from '@angular/forms/signals';
import type { UpdateProfile } from '@link-sharing/shared-models';
import {
  catchError,
  firstValueFrom,
  of,
  throwError,
} from 'rxjs';
import { AuthApiService } from '../../api/auth-api.service';
import { AvatarApiService } from '../../api/avatar-api.service';
import { ProfileApiService } from '../../api/profile-api.service';
import { ButtonComponent } from '../../atoms/button/button.component';
import { ImageUploadComponent } from '../../atoms/image-upload/image-upload.component';
import { InputComponent } from '../../atoms/input/input.component';
import { MainTemplateComponent } from '../../templates/main-template/main-template.component';

interface AccountModel {
  email: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    ImageUploadComponent,
    InputComponent,
    MainTemplateComponent,
  ],
  selector: 'app-profile',
  template: `
    <app-main-template
      [avatarUrl]="previewAvatarUrl()"
      [email]="account().email || null"
      [firstName]="profile().firstName || null"
      [lastName]="profile().lastName || null"
    >
      <div class="profile-page">
        <header class="profile-page__intro">
          <h1 class="profile-page__title" id="profile-title">
            Profile Details
          </h1>
          <p class="profile-page__description">
            Add your details to create a personal touch to your profile.
          </p>
        </header>

        @if (isLoading()) {
          <p class="profile-page__status" role="status">
            Loading your profile…
          </p>
        } @else {
          <form
            class="profile-page__form"
            id="profile-details-form"
            aria-labelledby="profile-title"
            (submit)="onSubmit($event)"
          >
            <section
              aria-labelledby="profile-picture-label"
              class="profile-page__section"
            >
              <div class="profile-page__picture-row">
                <p
                  class="profile-page__field-label"
                  id="profile-picture-label"
                >
                  Profile picture
                </p>

                <div class="profile-page__upload">
                  <app-image-upload
                    [imageUrl]="previewAvatarUrl()"
                    (fileRejected)="onImageRejected($event)"
                    (imageSelected)="onImageSelected($event)"
                  />
                  <p class="profile-page__hint">
                    Image must be JPEG, PNG, or WebP and no larger than 5 MB.
                  </p>
                </div>
              </div>
            </section>

            <section
              aria-label="Personal information"
              class="profile-page__section profile-page__details"
            >
              <div class="profile-page__field">
                <span class="profile-page__field-label">First name*</span>
                <app-input
                  ariaLabel="First name"
                  placeholder="e.g. John"
                  [icon]="null"
                  [errorMessage]="firstNameError()"
                  [formField]="profileForm.firstName"
                  [isError]="showFirstNameError()"
                />
              </div>

              <div class="profile-page__field">
                <span class="profile-page__field-label">Last name*</span>
                <app-input
                  ariaLabel="Last name"
                  placeholder="e.g. Appleseed"
                  [icon]="null"
                  [errorMessage]="lastNameError()"
                  [formField]="profileForm.lastName"
                  [isError]="showLastNameError()"
                />
              </div>

              <div class="profile-page__field">
                <span class="profile-page__field-label">Email</span>
                <app-input
                  ariaLabel="Email"
                  icon="email"
                  placeholder="e.g. email@example.com"
                  type="email"
                  [formField]="accountForm.email"
                />
              </div>
            </section>
          </form>
        }

        @if (message()) {
          <p
            class="profile-page__message"
            [class.profile-page__message--error]="hasError()"
            [attr.role]="hasError() ? 'alert' : 'status'"
          >
            {{ message() }}
          </p>
        }

        @if (canRetry()) {
          <div class="profile-page__retry">
            <app-button variant="secondary" (click)="onRetry()">
              Retry
            </app-button>
          </div>
        }
      </div>

      <div class="profile-page__save" main-template-actions>
        <app-button
          formId="profile-details-form"
          type="submit"
          [disabled]="isLoading() || isSubmitting()"
        >
          {{ isSubmitting() ? 'Saving…' : 'Save' }}
        </app-button>
      </div>
    </app-main-template>
  `,
  styles: `
    .profile-page {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-500);

      &__intro {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-100);
      }

      &__title,
      &__description,
      &__field-label,
      &__hint,
      &__status,
      &__message {
        margin: 0;
        line-height: var(--line-height-150);
      }

      &__title {
        color: var(--color-grey-900);
        font-size: var(--font-size-32);
        font-weight: var(--font-weight-bold);
      }

      &__description,
      &__field-label {
        color: var(--color-grey-500);
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-regular);
      }

      &__form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-300);
      }

      &__section {
        padding: var(--spacing-300);
        border-radius: 12px;
        background: var(--color-grey-50);
      }

      &__picture-row,
      &__field {
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr);
        align-items: center;
        gap: var(--spacing-200);
      }

      &__upload {
        display: flex;
        min-width: 0;
        align-items: center;
        gap: var(--spacing-300);
      }

      &__hint {
        max-width: 215px;
        color: var(--color-grey-500);
        font-size: var(--font-size-12);
        font-weight: var(--font-weight-regular);
      }

      &__details {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-200);
      }

      &__field {
        cursor: text;

        app-input {
          min-width: 0;
        }
      }

      &__status,
      &__message {
        color: var(--color-grey-500);
        font-size: var(--font-size-16);
      }

      &__message {
        color: var(--color-purple-600);

        &--error {
          color: var(--color-red-500);
        }
      }

      &__save {
        min-width: 91px;
      }

      &__retry {
        width: fit-content;
      }
    }

    @media (width < 760px) {
      .profile-page {
        gap: var(--spacing-400);

        &__title {
          font-size: var(--font-size-24);
        }

        &__picture-row,
        &__field {
          grid-template-columns: 1fr;
          align-items: stretch;
          gap: var(--spacing-100);
        }

        &__upload {
          align-items: flex-start;
        }
      }
    }

    @media (width < 520px) {
      .profile-page {
        &__section {
          padding: var(--spacing-200);
        }

        &__upload {
          flex-direction: column;
        }

        &__hint {
          max-width: none;
        }

        &__save {
          width: 100%;
        }
      }
    }
  `,
})
export class ProfileComponent implements OnDestroy {
  private readonly authApi = inject(AuthApiService);
  private readonly avatarApi = inject(AvatarApiService);
  private readonly profileApi = inject(ProfileApiService);
  private readonly profileModel = signal<UpdateProfile>({
    firstName: '',
    lastName: '',
  });
  private readonly accountModel = signal<AccountModel>({ email: '' });
  private readonly avatarUrl = signal<string | null>(null);
  private readonly selectedAvatar = signal<File | null>(null);
  private readonly localAvatarUrl = signal<string | null>(null);
  private readonly hasSubmitted = signal(false);
  private readonly messageIsError = signal(false);
  private objectUrl: string | null = null;

  public readonly profile = this.profileModel.asReadonly();
  public readonly account = this.accountModel.asReadonly();
  public readonly profileForm = form(this.profileModel, (path) => {
    required(path.firstName, { message: 'First name is required' });
    required(path.lastName, { message: 'Last name is required' });
  });
  public readonly accountForm = form(this.accountModel, (path) => {
    disabled(path.email);
  });
  public readonly isLoading = signal(true);
  public readonly canRetry = signal(false);
  public readonly message = signal('');
  public readonly hasError = this.messageIsError.asReadonly();
  public readonly isSubmitting = computed(() =>
    this.profileForm().submitting(),
  );
  public readonly previewAvatarUrl = computed(
    () => this.localAvatarUrl() ?? this.avatarUrl(),
  );
  public readonly showFirstNameError = computed(
    () =>
      this.profileForm.firstName().invalid() &&
      (this.profileForm.firstName().touched() || this.hasSubmitted()),
  );
  public readonly showLastNameError = computed(
    () =>
      this.profileForm.lastName().invalid() &&
      (this.profileForm.lastName().touched() || this.hasSubmitted()),
  );
  public readonly firstNameError = computed(
    () => this.profileForm.firstName().errors()[0]?.message ?? '',
  );
  public readonly lastNameError = computed(
    () => this.profileForm.lastName().errors()[0]?.message ?? '',
  );

  public constructor() {
    void this.loadProfile();
  }

  public ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  public onImageSelected(file: File): void {
    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.localAvatarUrl.set(this.objectUrl);
    this.selectedAvatar.set(file);
    this.clearMessage();
  }

  public onImageRejected(message: string): void {
    this.setError(message);
  }

  public onSubmit(event: Event): void {
    event.preventDefault();
    this.hasSubmitted.set(true);
    this.clearMessage();
    void this.saveProfile();
  }

  public onRetry(): void {
    void this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    this.isLoading.set(true);
    this.canRetry.set(false);
    this.clearMessage();

    const [accountResult, avatarResult, profileResult] =
      await Promise.allSettled([
        firstValueFrom(this.authApi.me()),
        firstValueFrom(
          this.avatarApi.get().pipe(
            catchError((error: unknown) =>
              this.isNotFound(error) ? of(null) : throwError(() => error),
            ),
          ),
        ),
        firstValueFrom(
          this.profileApi.get().pipe(
            catchError((error: unknown) =>
              this.isNotFound(error) ? of(null) : throwError(() => error),
            ),
          ),
        ),
      ]);

    if (accountResult.status === 'fulfilled') {
      this.accountModel.set({ email: accountResult.value.email ?? '' });
    }

    if (avatarResult.status === 'fulfilled') {
      this.avatarUrl.set(avatarResult.value?.avatarUrl ?? null);
    }

    if (profileResult.status === 'fulfilled') {
      if (profileResult.value) {
        this.profileModel.set({
          firstName: profileResult.value.firstName,
          lastName: profileResult.value.lastName,
        });
      }
    }

    const hasFailure = [accountResult, avatarResult, profileResult].some(
      (result) => result.status === 'rejected',
    );

    if (hasFailure) {
      this.setError('Unable to load your profile. Please try again.');
      this.canRetry.set(true);
    }

    this.isLoading.set(false);
  }

  private async saveProfile(): Promise<void> {
    await submit(this.profileForm, async (submittedForm) => {
      const value = submittedForm().value();

      try {
        const savedProfile = await firstValueFrom(
          this.profileApi.update({
            firstName: value.firstName,
            lastName: value.lastName,
          }),
        );

        this.profileModel.set({
          firstName: savedProfile.firstName,
          lastName: savedProfile.lastName,
        });
      } catch {
        this.setError('Unable to save your profile. Please try again.');
        return;
      }

      const avatar = this.selectedAvatar();

      if (!avatar) {
        this.setSuccess('Your profile has been saved.');
        return;
      }

      try {
        const savedAvatar = await firstValueFrom(
          this.avatarApi.upload(avatar),
        );
        this.avatarUrl.set(savedAvatar.avatarUrl);
        this.selectedAvatar.set(null);
        this.revokeObjectUrl();
        this.setSuccess('Your profile has been saved.');
      } catch {
        this.setError(
          'Your details were saved, but the profile picture was not. Please try again.',
        );
      }
    });
  }

  private isNotFound(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 404;
  }

  private clearMessage(): void {
    this.message.set('');
    this.messageIsError.set(false);
  }

  private setError(message: string): void {
    this.message.set(message);
    this.messageIsError.set(true);
  }

  private setSuccess(message: string): void {
    this.message.set(message);
    this.messageIsError.set(false);
  }

  private revokeObjectUrl(): void {
    if (!this.objectUrl) {
      return;
    }

    URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null;
    this.localAvatarUrl.set(null);
  }
}
