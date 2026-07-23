import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
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
import { HomeFacadeService } from './_services/home-facade.service';
import { isPreviewableLink } from './_utils/is-previewable-link.util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    EmptyLinksComponent,
    LinkEditorCardComponent,
    MainTemplateComponent,
  ],
  providers: [HomeFacadeService],
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
          <app-button
            variant="secondary"
            [disabled]="isLoading() || isSaving()"
            (click)="addLink()"
          >
            + Add new link
          </app-button>

          @if (isLoading()) {
            <p class="home-page__message" role="status">
              Loading your links…
            </p>
          } @else if (drafts().length === 0) {
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

          @if (message()) {
            <p
              class="home-page__message"
              [class.home-page__message--error]="hasError()"
              [attr.role]="hasError() ? 'alert' : 'status'"
            >
              {{ message() }}
            </p>
          }
        </div>
      </div>

      <div class="home-page__save" main-template-actions>
        <app-button
          [disabled]="isLoading() || isSaving() || !hasChanges()"
          (click)="saveLinks()"
        >
          {{ isSaving() ? 'Saving…' : 'Save' }}
        </app-button>
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

      &__message {
        margin: 0;
        color: var(--color-purple-600);
        font-size: var(--font-size-16);
        line-height: var(--line-height-150);

        &--error {
          color: var(--color-red-500);
        }
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
  private readonly injector = inject(Injector);
  private readonly facade = inject(HomeFacadeService);
  private nextDraftId = 1;

  public readonly drafts = signal<readonly HomeLinkDraft[]>([]);
  public readonly isLoading = this.facade.isLoading;
  public readonly isSaving = this.facade.isSaving;
  public readonly message = this.facade.message;
  public readonly hasError = this.facade.hasError;
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
  public readonly hasChanges = computed(() => {
    const drafts = this.drafts();
    const savedLinks = this.facade.savedLinks();

    if (drafts.length !== savedLinks.length) {
      return true;
    }

    return drafts.some((draft) => {
      const saved = savedLinks.find((link) => link.id === draft.serverId);

      return (
        !saved ||
        saved.platform !== draft.platform() ||
        saved.url !== draft.urlForm().value().url.trim()
      );
    });
  });

  public constructor() {
    void this.loadLinks();
  }

  public addLink(): void {
    this.facade.clearMessage();
    this.drafts.update((drafts) => [
      ...drafts,
      this.createDraft(null, null, ''),
    ]);
  }

  public removeLink(id: number): void {
    this.facade.clearMessage();
    this.drafts.update((drafts) => drafts.filter((draft) => draft.id !== id));
  }

  public saveLinks(): void {
    void this.persistLinks();
  }

  private async loadLinks(): Promise<void> {
    const links = await this.facade.loadLinks();

    if (links) {
      this.drafts.set(
        links.map((link) =>
          this.createDraft(link.id, link.platform, link.url),
        ),
      );
    }
  }

  private async persistLinks(): Promise<void> {
    const entries = this.drafts().map((draft) => {
      const platform = draft.platform();
      const url = draft.urlForm().value().url.trim();

      return { draft, platform, url };
    });

    if (
      entries.some(
        ({ platform, url }) => !isPreviewableLink(platform, url),
      )
    ) {
      this.facade.setValidationError(
        'Choose a platform and enter a matching HTTPS URL for every link.',
      );
      return;
    }

    const savedLinks = await this.facade.saveLinks(
      entries.map(({ draft, platform, url }) => ({
        serverId: draft.serverId,
        platform: platform as Platform,
        url,
      })),
    );

    if (savedLinks) {
      this.drafts.set(
        savedLinks.map((link) =>
          this.createDraft(link.id, link.platform, link.url),
        ),
      );
    }
  }

  private createDraft(
    serverId: string | null,
    platform: Platform | null,
    url: string,
  ): HomeLinkDraft {
    const urlModel = signal({ url });

    return {
      id: this.nextDraftId++,
      serverId,
      platform: signal(platform),
      urlForm: form(urlModel, { injector: this.injector }),
    };
  }
}
