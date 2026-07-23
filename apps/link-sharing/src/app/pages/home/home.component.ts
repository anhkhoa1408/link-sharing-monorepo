import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import type { Platform } from '@link-sharing/shared-models';
import { ButtonComponent } from '../../atoms/button/button.component';
import { MainTemplateComponent } from '../../templates/main-template/main-template.component';
import { LinkEditorCardComponent } from './_components/link-editor-card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    LinkEditorCardComponent,
    MainTemplateComponent,
  ],
  selector: 'app-home',
  template: `
    <app-main-template>
      <div class="home-page">
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

      <div class="home-page__save" main-template-actions>
        <app-button>Save</app-button>
      </div>
    </app-main-template>
  `,
  styles: `
    .home-page {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-500);

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

      &__save {
        min-width: 91px;
      }
    }

    @media (width < 600px) {
      .home-page {
        gap: var(--spacing-400);

        &__title {
          font-size: var(--font-size-24);
        }

        &__save {
          width: 100%;
        }
      }
    }
  `,
})
export class HomeComponent {
  private readonly exampleLinks = signal({
    githubUrl: 'https://www.github.com/johnappleseed',
    youtubeUrl: 'https://www.youtube.com/benwright',
  });

  public readonly linksForm = form(this.exampleLinks);
  public readonly githubPlatform = signal<Platform | null>('GITHUB');
  public readonly youtubePlatform = signal<Platform | null>('YOUTUBE');
}
