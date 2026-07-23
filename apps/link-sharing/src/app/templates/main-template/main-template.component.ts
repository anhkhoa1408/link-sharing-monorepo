import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../atoms/button/button.component';
import { AuthService } from '../../core/auth.service';
import type { PreviewLink } from '../../core/models/preview-link.model';
import { TabButtonComponent } from '../../molecules/tab-button/tab-button.component';
import { PhonePreviewComponent } from '../../organisms/phone-preview/phone-preview.component';

const DEFAULT_PREVIEW_LINKS: readonly PreviewLink[] = [
  {
    id: 1,
    platform: 'GITHUB',
    url: 'https://github.com/johnappleseed',
  },
  {
    id: 2,
    platform: 'YOUTUBE',
    url: 'https://youtube.com/benwright',
  },
  {
    id: 3,
    platform: 'LINKEDIN',
    url: 'https://linkedin.com/in/johnappleseed',
  },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    NgOptimizedImage,
    PhonePreviewComponent,
    TabButtonComponent,
  ],
  selector: 'app-main-template',
  template: `
    <div class="main-template">
      <header class="main-template__header">
        <div class="main-template__logo">
          <img
            alt="Devlinks"
            height="32"
            ngSrc="/images/logo-devlinks-large.svg"
            priority
            width="146"
          />
        </div>

        <nav aria-label="Main navigation" class="main-template__navigation">
          <app-tab-button icon="link" label="Links" route="/home" />
          <app-tab-button
            icon="profile"
            label="Profile Details"
            route="/profile"
          />
        </nav>

        <div class="main-template__header-actions">
          <app-button
            class="main-template__header-action"
            variant="secondary"
            (click)="onLogout()"
          >
            Logout
          </app-button>
          <app-button
            class="main-template__header-action"
            variant="secondary"
            (click)="onPreview()"
          >
            Preview
          </app-button>
        </div>
      </header>

      <main class="main-template__main">
        <aside class="main-template__preview-panel">
          <app-phone-preview
            [avatarUrl]="avatarUrl()"
            [email]="email()"
            [firstName]="firstName()"
            [lastName]="lastName()"
            [links]="links()"
          />
        </aside>

        <section class="main-template__editor">
          <div class="main-template__editor-content">
            <ng-content />
          </div>

          <footer class="main-template__footer">
            <ng-content select="[main-template-actions]" />
          </footer>
        </section>
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: var(--color-grey-50);
      font-family: 'Instrument Sans', sans-serif;
    }

    .main-template {
      display: flex;
      min-height: 100dvh;
      flex-direction: column;
      gap: var(--spacing-200);
      padding: var(--spacing-300);

      &__header {
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-200) var(--spacing-200) var(--spacing-200)
          var(--spacing-300);
        border-radius: 12px;
        background: var(--color-white);
      }

      &__logo {
        width: 146px;
        height: 32px;
        flex: 0 0 146px;
        overflow: hidden;

        img {
          display: block;
          max-width: none;
        }
      }

      &__navigation {
        position: absolute;
        left: 50%;
        display: flex;
        align-items: center;
        gap: var(--spacing-200);
        transform: translateX(-50%);
      }

      &__header-actions {
        display: flex;
        gap: var(--spacing-200);
      }

      &__header-action {
        display: block;
        min-width: 108px;
      }

      &__main {
        display: flex;
        min-height: 0;
        flex: 1 1 auto;
        gap: var(--spacing-300);
      }

      &__preview-panel,
      &__editor {
        border-radius: 12px;
        background: var(--color-white);
      }

      &__preview-panel {
        display: flex;
        width: 560px;
        flex: 0 0 560px;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-300);
      }

      &__editor {
        display: flex;
        min-width: 0;
        flex: 1 1 auto;
        flex-direction: column;
        overflow: hidden;
      }

      &__editor-content {
        display: flex;
        min-height: 0;
        flex: 1 1 auto;
        flex-direction: column;
        padding: var(--spacing-500);
        overflow: auto;
      }

      &__footer {
        display: flex;
        justify-content: flex-end;
        padding: var(--spacing-300) var(--spacing-500);
        border-top: 1px solid var(--color-grey-200);
      }
    }

    @media (width < 1200px) {
      .main-template {
        &__preview-panel {
          display: none;
        }
      }
    }

    @media (width < 900px) {
      .main-template {
        &__header {
          display: grid;
          grid-template-columns: 32px minmax(0, 1fr) auto;
          gap: var(--spacing-100);
          padding: var(--spacing-200);
        }

        &__logo {
          width: 32px;
          flex-basis: 32px;
        }

        &__navigation {
          position: static;
          gap: 0;
          justify-self: center;
          transform: none;
        }
      }
    }

    @media (width < 600px) {
      .main-template {
        gap: var(--spacing-200);
        padding: var(--spacing-200);

        &__header {
          grid-template-columns: 32px minmax(0, 1fr);
        }

        &__navigation {
          justify-self: end;
        }

        &__header-actions {
          width: 100%;
          grid-column: 1 / -1;
          gap: var(--spacing-100);
        }

        &__header-action {
          min-width: 0;
          flex: 1 1 0;
        }

        &__editor-content {
          padding: var(--spacing-300) var(--spacing-200);
        }

        &__footer {
          padding: var(--spacing-200);
        }
      }
    }
  `,
})
export class MainTemplateComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  public readonly firstName = input<string | null>(null);
  public readonly lastName = input<string | null>(null);
  public readonly email = input<string | null>(null);
  public readonly avatarUrl = input<string | null>(null);
  public readonly links = input<readonly PreviewLink[]>(DEFAULT_PREVIEW_LINKS);

  protected onLogout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  protected onPreview(): void {
    void this.router.navigateByUrl('/preview');
  }
}
