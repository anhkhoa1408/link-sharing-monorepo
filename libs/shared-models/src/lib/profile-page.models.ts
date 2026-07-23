import type { Platform } from './link.models';

export interface ProfilePageLink {
  readonly id: string;
  readonly platform: Platform;
  readonly url: string;
}

export interface ProfilePage {
  readonly userId: string;
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl: string | null;
  readonly links: readonly ProfilePageLink[];
}
