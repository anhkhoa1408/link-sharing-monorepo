import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnDestroy,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../atoms/button/button.component';
import { PreviewTagComponent } from '../../molecules/preview-tag/preview-tag.component';
import { ProfilePageFacadeService } from './_services/profile-page-facade.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, PreviewTagComponent],
  providers: [ProfilePageFacadeService],
  selector: 'app-profile-page',
  template: `
    <div class="profile-page">
      <div aria-hidden="true" class="profile-page__background"></div>

      @if (isOwnerPreview()) {
        <header class="profile-page__header">
          <div class="profile-page__header-content">
            <app-button variant="secondary" (click)="onBackToEditor()">
              Back to Editor
            </app-button>
            <app-button
              [disabled]="!profilePage.hasValue()"
              (click)="onShareLink()"
            >
              Share Link
            </app-button>
          </div>
        </header>
      }

      <main
        class="profile-page__main"
        [class.profile-page__main--public]="!isOwnerPreview()"
      >
        @if (profilePage.isLoading()) {
          <section
            aria-live="polite"
            class="profile-page__state"
            role="status"
          >
            Loading profile…
          </section>
        } @else if (isPublicNotFound()) {
          <section class="profile-page__state" role="alert">
            <h1 class="profile-page__state-title">Profile not found</h1>
            <p class="profile-page__state-copy">
              This shared profile is unavailable or no longer exists.
            </p>
          </section>
        } @else if (profilePage.error()) {
          <section class="profile-page__state" role="alert">
            <h1 class="profile-page__state-title">
              We couldn’t load this profile
            </h1>
            <p class="profile-page__state-copy">
              Please check your connection and try again.
            </p>
            <div class="profile-page__retry">
              <app-button variant="secondary" (click)="onRetry()">
                Try again
              </app-button>
            </div>
          </section>
        } @else if (profilePage.value(); as profile) {
          <article
            class="profile-page__card"
            [attr.aria-label]="profile.displayName + ' profile'"
          >
            <header class="profile-page__identity">
              @if (profile.avatarUrl) {
                <img
                  class="profile-page__avatar"
                  height="104"
                  [alt]="profile.displayName + ' profile picture'"
                  [src]="profile.avatarUrl"
                  width="104"
                />
              } @else {
                <div
                  aria-hidden="true"
                  class="profile-page__avatar profile-page__avatar--placeholder"
                >
                  {{ avatarInitial(profile.displayName) }}
                </div>
              }

              <div class="profile-page__user">
                <h1 class="profile-page__name">{{ profile.displayName }}</h1>
                <p class="profile-page__email">{{ profile.email }}</p>
              </div>
            </header>

            <div class="profile-page__links">
              @for (link of profile.links; track link.id) {
                <app-preview-tag
                  [platform]="link.platform"
                  [url]="link.url"
                />
              } @empty {
                <p class="profile-page__empty">
                  This profile has no shared links yet.
                </p>
              }
            </div>
          </article>
        }
      </main>

      @if (clipboardMessage()) {
        <div
          aria-live="polite"
          class="profile-page__toast"
          [class.profile-page__toast--error]="clipboardFailed()"
          role="status"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path
              d="M8.333 10.833a3.333 3.333 0 0 0 4.714.047l2-2a3.333 3.333 0 0 0-4.714-4.713l-1.146 1.14m2.48 3.86a3.333 3.333 0 0 0-4.714-.047l-2 2a3.333 3.333 0 0 0 4.714 4.713l1.14-1.14"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
          <span>{{ clipboardMessage() }}</span>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: var(--color-grey-50);
      color: var(--color-grey-900);
      font-family: 'Instrument Sans', sans-serif;
    }

    .profile-page {
      position: relative;
      min-height: 100dvh;

      &__background {
        position: absolute;
        inset: 0 0 auto;
        height: 357px;
        border-radius: 0 0 32px 32px;
        background: var(--color-purple-600);
      }

      &__header {
        position: relative;
        z-index: 1;
        padding: var(--spacing-300);
      }

      &__header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-200) var(--spacing-200) var(--spacing-200)
          var(--spacing-300);
        border-radius: 12px;
        background: var(--color-white);

        app-button {
          display: block;
        }
      }

      &__main {
        position: relative;
        z-index: 1;
        display: flex;
        justify-content: center;
        padding: 55px var(--spacing-300) 152px;

        &--public {
          padding-top: 159px;
        }
      }

      &__card,
      &__state {
        width: min(349px, 100%);
        border-radius: 24px;
        background: var(--color-white);
        box-shadow: 0 0 32px rgb(0 0 0 / 10%);
      }

      &__card {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-700);
        padding: var(--spacing-600) var(--spacing-700);
      }

      &__identity,
      &__user {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &__identity {
        gap: var(--spacing-300);
      }

      &__avatar {
        display: block;
        width: 104px;
        height: 104px;
        flex: 0 0 104px;
        border: 4px solid var(--color-purple-600);
        border-radius: 50%;
        object-fit: cover;

        &--placeholder {
          display: grid;
          place-items: center;
          background: var(--color-purple-100);
          color: var(--color-purple-600);
          font-size: var(--font-size-32);
          font-weight: var(--font-weight-bold);
        }
      }

      &__user {
        max-width: 100%;
        gap: var(--spacing-100);
        text-align: center;
      }

      &__name,
      &__email,
      &__empty,
      &__state-title,
      &__state-copy {
        margin: 0;
        line-height: var(--line-height-150);
      }

      &__name {
        max-width: 100%;
        overflow-wrap: anywhere;
        font-size: var(--font-size-32);
        font-weight: var(--font-weight-bold);
      }

      &__email,
      &__empty,
      &__state-copy {
        color: var(--color-grey-500);
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-regular);
      }

      &__email {
        max-width: 100%;
        overflow-wrap: anywhere;
      }

      &__links {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-300);
      }

      &__empty {
        text-align: center;
      }

      &__state {
        padding: var(--spacing-600);
        text-align: center;
      }

      &__state-title {
        font-size: var(--font-size-24);
        font-weight: var(--font-weight-bold);
      }

      &__state-copy {
        margin-top: var(--spacing-100);
      }

      &__retry {
        width: 120px;
        margin: var(--spacing-300) auto 0;
      }

      &__toast {
        position: fixed;
        z-index: 2;
        bottom: var(--spacing-500);
        left: 50%;
        display: flex;
        align-items: center;
        gap: var(--spacing-100);
        max-width: calc(100vw - 2 * var(--spacing-300));
        padding: var(--spacing-200) var(--spacing-300);
        border-radius: 12px;
        background: var(--color-grey-900);
        box-shadow: 0 0 32px rgb(0 0 0 / 10%);
        color: var(--color-grey-50);
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-semibold);
        line-height: var(--line-height-150);
        transform: translateX(-50%);

        svg {
          width: 20px;
          height: 20px;
          flex: 0 0 20px;
          color: var(--color-grey-500);
        }

        &--error {
          background: var(--color-red-550);

          svg {
            color: var(--color-white);
          }
        }
      }
    }

    @media (width < 600px) {
      .profile-page {
        &__background {
          display: none;
        }

        &__header {
          padding: var(--spacing-200);
        }

        &__header-content {
          flex-wrap: wrap;
          gap: var(--spacing-200);
          padding: var(--spacing-200);

          app-button {
            flex: 1 1 140px;
            min-width: 0;
          }
        }

        &__main,
        &__main--public {
          padding: var(--spacing-700) var(--spacing-300) 120px;
        }

        &__card,
        &__state {
          background: transparent;
          box-shadow: none;
        }

        &__card {
          padding: 0;
        }

        &__name {
          font-size: var(--font-size-24);
        }

        &__state {
          padding: var(--spacing-300) 0;
        }

        &__toast {
          bottom: var(--spacing-200);
          width: max-content;
          padding: var(--spacing-200);
          font-size: var(--font-size-12);
        }
      }
    }

  `,
})
export class ProfilePageComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly facade = inject(ProfilePageFacadeService);
  private readonly router = inject(Router);
  private clipboardTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly isOwnerPreview = this.facade.isOwnerPreview;
  protected readonly profilePage = this.facade.profilePage;
  protected readonly isPublicNotFound = this.facade.isPublicNotFound;
  protected readonly clipboardMessage = signal('');
  protected readonly clipboardFailed = signal(false);

  public ngOnDestroy(): void {
    if (this.clipboardTimer) {
      clearTimeout(this.clipboardTimer);
    }
  }

  protected avatarInitial(displayName: string): string {
    return displayName.trim().charAt(0).toUpperCase() || '?';
  }

  protected onBackToEditor(): void {
    void this.router.navigateByUrl('/home');
  }

  protected onRetry(): void {
    this.facade.reload();
  }

  protected async onShareLink(): Promise<void> {
    const profile = this.profilePage.value();
    const view = this.document.defaultView;

    if (!profile || !view?.navigator.clipboard) {
      this.showClipboardMessage(
        'We couldn’t copy the link. Please copy it from your browser.',
        true,
      );
      return;
    }

    const shareUrl = new URL(
      `/share/${profile.userId}`,
      view.location.origin,
    ).toString();

    try {
      await view.navigator.clipboard.writeText(shareUrl);
      this.showClipboardMessage(
        'The link has been copied to your clipboard!',
        false,
      );
    } catch {
      this.showClipboardMessage(
        'We couldn’t copy the link. Please copy it from your browser.',
        true,
      );
    }
  }

  private showClipboardMessage(message: string, failed: boolean): void {
    if (this.clipboardTimer) {
      clearTimeout(this.clipboardTimer);
    }

    this.clipboardFailed.set(failed);
    this.clipboardMessage.set(message);
    this.clipboardTimer = setTimeout(() => {
      this.clipboardMessage.set('');
      this.clipboardTimer = null;
    }, 4_000);
  }
}
