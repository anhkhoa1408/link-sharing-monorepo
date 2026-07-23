import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import type { Platform } from '@link-sharing/shared-models';
import { ButtonComponent } from '../../atoms/button/button.component';
import { HomeHeaderComponent } from './_components/home-header.component';
import { LinkEditorCardComponent } from './_components/link-editor-card.component';
import { PhonePreviewComponent } from './_components/phone-preview.component';

interface HomeExampleLinks {
  githubUrl: string;
  youtubeUrl: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    HomeHeaderComponent,
    LinkEditorCardComponent,
    PhonePreviewComponent,
  ],
  selector: 'app-home',
  template: `
    <div class="home-page">
      <app-home-header />

      <main class="home-page__main">
        <aside class="home-page__preview-panel">
          <app-phone-preview />
        </aside>

        <section aria-labelledby="home-title" class="home-page__editor">
          <div class="home-page__editor-content">
            <header class="home-page__intro">
              <h1 class="home-page__title" id="home-title">
                Customize your links
              </h1>
              <p class="home-page__description">
                Add/edit/remove links below and then share all your profiles
                with the world!
              </p>
            </header>

            <div class="home-page__links">
              <app-button variant="secondary">+ Add new link</app-button>

              <app-link-editor-card
                [index]="1"
                [urlField]="linksForm.githubUrl"
                [(platform)]="githubPlatform"
              />
              <app-link-editor-card
                [index]="2"
                [urlField]="linksForm.youtubeUrl"
                [(platform)]="youtubePlatform"
              />
            </div>
          </div>

          <footer class="home-page__footer">
            <div class="home-page__save">
              <app-button>Save</app-button>
            </div>
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

    .home-page {
      display: flex;
      min-height: 100dvh;
      flex-direction: column;
      gap: var(--spacing-200);
      padding: var(--spacing-300);

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
        gap: var(--spacing-500);
        padding: var(--spacing-500);
        overflow: auto;
      }

      &__intro {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-100);
      }

      &__title,
      &__description {
        margin: 0;
        line-height: var(--line-height-150);
      }

      &__title {
        color: var(--color-grey-900);
        font-size: var(--font-size-32);
        font-weight: var(--font-weight-bold);
      }

      &__description {
        color: var(--color-grey-500);
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-regular);
      }

      &__links {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-300);
      }

      &__footer {
        display: flex;
        justify-content: flex-end;
        padding: var(--spacing-300) var(--spacing-500);
        border-top: 1px solid var(--color-grey-200);
      }

      &__save {
        min-width: 91px;
      }
    }

    @media (width < 1200px) {
      .home-page {
        &__preview-panel {
          display: none;
        }
      }
    }

    @media (width < 600px) {
      .home-page {
        gap: var(--spacing-200);
        padding: var(--spacing-200);

        &__editor-content {
          gap: var(--spacing-400);
          padding: var(--spacing-300) var(--spacing-200);
        }

        &__title {
          font-size: var(--font-size-24);
        }

        &__footer {
          padding: var(--spacing-200);
        }

        &__save {
          width: 100%;
        }
      }
    }
  `,
})
export class HomeComponent {
  private readonly exampleLinks = signal<HomeExampleLinks>({
    githubUrl: 'https://www.github.com/johnappleseed',
    youtubeUrl: 'https://www.youtube.com/benwright',
  });

  public readonly linksForm = form(this.exampleLinks);
  public readonly githubPlatform = signal<Platform | null>('GITHUB');
  public readonly youtubePlatform = signal<Platform | null>('YOUTUBE');
}
