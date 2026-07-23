import type { WritableSignal } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import type { Platform } from '@link-sharing/shared-models';

export interface HomeLinkDraft {
  readonly id: number;
  readonly platform: WritableSignal<Platform | null>;
  readonly urlForm: FieldTree<{ url: string }>;
}
