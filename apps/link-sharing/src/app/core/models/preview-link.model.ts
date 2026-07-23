import type { Platform } from '@link-sharing/shared-models';

export interface PreviewLink {
  readonly id: number;
  readonly platform: Platform;
  readonly url: string;
}
