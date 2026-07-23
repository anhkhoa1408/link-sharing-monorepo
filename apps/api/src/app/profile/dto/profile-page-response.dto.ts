import type {
  Platform,
  ProfilePage,
  ProfilePageLink,
} from '@link-sharing/shared-models';

export class ProfilePageLinkResponseDto implements ProfilePageLink {
  readonly id!: string;
  readonly platform!: Platform;
  readonly url!: string;
}

export class ProfilePageResponseDto implements ProfilePage {
  readonly userId!: string;
  readonly displayName!: string;
  readonly email!: string;
  readonly avatarUrl!: string | null;
  readonly links!: readonly ProfilePageLinkResponseDto[];
}
