import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import type {
  Profile,
  UpdateProfile,
} from '@link-sharing/shared-models';
import {
  catchError,
  firstValueFrom,
  of,
  throwError,
} from 'rxjs';
import { AuthApiService } from '../../../api/auth-api.service';
import { AvatarApiService } from '../../../api/avatar-api.service';
import { LinkApiService } from '../../../api/link-api.service';
import { ProfileApiService } from '../../../api/profile-api.service';
import type { PreviewLink } from '../../../core/models/preview-link.model';

export interface ProfileFacadeData {
  readonly email?: string;
  readonly avatarUrl?: string | null;
  readonly profile?: Profile | null;
  readonly previewLinks?: readonly PreviewLink[];
}

export interface ProfileSaveResult {
  readonly profile: Profile;
  readonly avatarUrl?: string;
}

@Injectable()
export class ProfileFacadeService {
  private readonly authApi = inject(AuthApiService);
  private readonly avatarApi = inject(AvatarApiService);
  private readonly linkApi = inject(LinkApiService);
  private readonly profileApi = inject(ProfileApiService);
  private readonly dataState = signal<ProfileFacadeData>({});
  private readonly isLoadingState = signal(true);
  private readonly canRetryState = signal(false);
  private readonly messageState = signal('');
  private readonly hasErrorState = signal(false);

  public readonly data = this.dataState.asReadonly();
  public readonly isLoading = this.isLoadingState.asReadonly();
  public readonly canRetry = this.canRetryState.asReadonly();
  public readonly message = this.messageState.asReadonly();
  public readonly hasError = this.hasErrorState.asReadonly();

  public async load(): Promise<void> {
    this.isLoadingState.set(true);
    this.canRetryState.set(false);
    this.clearMessage();

    const [accountResult, avatarResult, profileResult, linksResult] =
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
        firstValueFrom(this.linkApi.getAll()),
      ]);

    this.dataState.update((data) => ({
      ...data,
      ...(accountResult.status === 'fulfilled'
        ? { email: accountResult.value.email ?? '' }
        : {}),
      ...(avatarResult.status === 'fulfilled'
        ? { avatarUrl: avatarResult.value?.avatarUrl ?? null }
        : {}),
      ...(profileResult.status === 'fulfilled'
        ? { profile: profileResult.value }
        : {}),
      ...(linksResult.status === 'fulfilled'
        ? {
            previewLinks: linksResult.value.map((link, index) => ({
              id: index,
              platform: link.platform,
              url: link.url,
            })),
          }
        : {}),
    }));

    const hasFailure = [
      accountResult,
      avatarResult,
      profileResult,
      linksResult,
    ].some((result) => result.status === 'rejected');

    if (hasFailure) {
      this.setError('Unable to load your profile. Please try again.');
      this.canRetryState.set(true);
    }

    this.isLoadingState.set(false);
  }

  public async save(
    profile: UpdateProfile,
    avatar: File | null,
  ): Promise<ProfileSaveResult | null> {
    this.clearMessage();

    let savedProfile: Profile;

    try {
      savedProfile = await firstValueFrom(this.profileApi.update(profile));
    } catch {
      this.setError('Unable to save your profile. Please try again.');
      return null;
    }

    if (!avatar) {
      this.setSuccess('Your profile has been saved.');
      return { profile: savedProfile };
    }

    try {
      const savedAvatar = await firstValueFrom(
        this.avatarApi.upload(avatar),
      );
      this.setSuccess('Your profile has been saved.');
      return {
        profile: savedProfile,
        avatarUrl: savedAvatar.avatarUrl,
      };
    } catch {
      this.setError(
        'Your details were saved, but the profile picture was not. Please try again.',
      );
      return { profile: savedProfile };
    }
  }

  public clearMessage(): void {
    this.messageState.set('');
    this.hasErrorState.set(false);
  }

  public setUiError(message: string): void {
    this.setError(message);
  }

  private isNotFound(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 404;
  }

  private setError(message: string): void {
    this.messageState.set(message);
    this.hasErrorState.set(true);
  }

  private setSuccess(message: string): void {
    this.messageState.set(message);
    this.hasErrorState.set(false);
  }
}
