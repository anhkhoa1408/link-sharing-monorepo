import { inject, Injectable, signal } from '@angular/core';
import type {
  Platform,
  SaveLink,
  UserLink,
} from '@link-sharing/shared-models';
import { firstValueFrom } from 'rxjs';
import { LinkApiService } from '../../../api/link-api.service';

export interface HomeLinkSaveEntry {
  readonly serverId: string | null;
  readonly platform: Platform;
  readonly url: string;
}

@Injectable()
export class HomeFacadeService {
  private readonly linkApi = inject(LinkApiService);
  private readonly savedLinksState = signal<readonly UserLink[]>([]);
  private readonly isLoadingState = signal(true);
  private readonly isSavingState = signal(false);
  private readonly messageState = signal('');
  private readonly hasErrorState = signal(false);

  public readonly savedLinks = this.savedLinksState.asReadonly();
  public readonly isLoading = this.isLoadingState.asReadonly();
  public readonly isSaving = this.isSavingState.asReadonly();
  public readonly message = this.messageState.asReadonly();
  public readonly hasError = this.hasErrorState.asReadonly();

  public async loadLinks(): Promise<readonly UserLink[] | null> {
    this.isLoadingState.set(true);
    this.clearMessage();

    try {
      const links = await firstValueFrom(this.linkApi.getAll());
      this.savedLinksState.set(links);
      return links;
    } catch {
      this.setError('Unable to load your links. Please refresh and try again.');
      return null;
    } finally {
      this.isLoadingState.set(false);
    }
  }

  public async saveLinks(
    entries: readonly HomeLinkSaveEntry[],
  ): Promise<readonly UserLink[] | null> {
    this.isSavingState.set(true);
    this.clearMessage();

    try {
      const activeServerIds = new Set(
        entries.flatMap(({ serverId }) => (serverId ? [serverId] : [])),
      );
      const removedLinks = this.savedLinksState().filter(
        (link) => !activeServerIds.has(link.id),
      );

      await Promise.all(
        removedLinks.map((link) =>
          firstValueFrom(this.linkApi.remove(link.id)),
        ),
      );

      const savedLinks = await Promise.all(
        entries.map(({ serverId, platform, url }) => {
          const link: SaveLink = { platform, url };

          return firstValueFrom(
            serverId
              ? this.linkApi.update(serverId, link)
              : this.linkApi.create(link),
          );
        }),
      );

      this.savedLinksState.set(savedLinks);
      this.setSuccess('Your links have been saved.');
      return savedLinks;
    } catch {
      this.setError('Unable to save your links. Please try again.');
      return null;
    } finally {
      this.isSavingState.set(false);
    }
  }

  public clearMessage(): void {
    this.messageState.set('');
    this.hasErrorState.set(false);
  }

  public setValidationError(message: string): void {
    this.setError(message);
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
