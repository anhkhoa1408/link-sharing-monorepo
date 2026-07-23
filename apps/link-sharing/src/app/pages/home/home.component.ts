import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { form } from '@angular/forms/signals';
import type { Platform } from '@link-sharing/shared-models';
import { ButtonComponent } from '../../atoms/button/button.component';
import type { PreviewLink } from '../../core/models/preview-link.model';
import { MainTemplateComponent } from '../../templates/main-template/main-template.component';
import { EmptyLinksComponent } from './_components/empty-links.component';
import { LinkEditorCardComponent } from './_components/link-editor-card.component';
import type { HomeLinkDraft } from './_models/home-link.model';
import { isPreviewableLink } from './_utils/is-previewable-link.util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    EmptyLinksComponent,
    LinkEditorCardComponent,
    MainTemplateComponent,
  ],
  selector: 'app-home',
  template: `
    <app-main-template [links]="previewLinks()">
      <div class="home-page">
        <header class="home-page__intro">
          <h1 class="home-page__title" id="home-title">Customize your links</h1>
          <p class="home-page__description">
            Add/edit/remove links below and then share all your profiles with
            the world!
          </p>
        </header>

        <div class="home-page__links">
          <app-button variant="secondary" (click)="addLink()">
            + Add new link
          </app-button>

          @if (drafts().length === 0) {
            <app-empty-links />
          } @else {
            @for (draft of drafts(); track draft.id; let index = $index) {
              <app-link-editor-card
                [index]="index + 1"
                [platform]="draft.platform()"
                [urlField]="draft.urlForm.url"
                (platformChange)="draft.platform.set($event)"
                (removed)="removeLink(draft.id)"
              />
            }
          }
        </div>
      </div>

      <div class="home-page__save" main-template-actions>
        <app-button [disabled]="drafts().length === 0">Save</app-button>
      </div>
    </app-main-template>
  `,
  styles: `
    .home-page {
      display: flex;
      min-height: 100%;
      flex: 1 1 auto;
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
        min-height: 0;
        flex: 1 1 auto;
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
  private nextDraftId = 1;

  public readonly drafts = signal<readonly HomeLinkDraft[]>([]);
  public readonly previewLinks = computed<readonly PreviewLink[]>(() =>
    this.drafts().flatMap<PreviewLink>((draft) => {
      const platform = draft.platform();
      const url = draft.urlForm().value().url.trim();

      if (!isPreviewableLink(platform, url)) {
        return [];
      }

      return [{ id: draft.id, platform, url }];
    }),
  );

  public addLink(): void {
    const urlModel = signal({ url: '' });
    const draft: HomeLinkDraft = {
      id: this.nextDraftId++,
      platform: signal<Platform | null>(null),
      urlForm: form(urlModel),
    };

    this.drafts.update((drafts) => [...drafts, draft]);
  }

  public removeLink(id: number): void {
    this.drafts.update((drafts) => drafts.filter((draft) => draft.id !== id));
  }
}
