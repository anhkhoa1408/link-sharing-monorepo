import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type OnDestroy,
  output,
  signal,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-image-upload',
  styles: `
    :host {
      display: inline-block;
    }

    .image-upload {
      position: relative;
      display: inline-block;
      cursor: pointer;

      &__input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;

        &:focus-visible + .image-upload__tile {
          outline: 2px solid var(--color-purple-600);
          outline-offset: 4px;
        }
      }

      &__tile {
        position: relative;
        display: flex;
        width: 193px;
        height: 193px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-100);
        overflow: hidden;
        border-radius: 12px;
        background: var(--color-purple-100);
        color: var(--color-purple-600);

        &--preview {
          background: var(--color-black);
          color: var(--color-white);
        }
      }

      &__preview,
      &__overlay {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border-radius: inherit;
      }

      &__preview {
        object-fit: cover;
      }

      &__overlay {
        background: rgb(0 0 0 / 50%);
      }

      &__icon,
      &__label {
        position: relative;
        z-index: 1;
      }

      &__icon {
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        background: currentColor;
        mask: url('/images/icon-image.svg') center / contain no-repeat;
        -webkit-mask: url('/images/icon-image.svg') center / contain no-repeat;
      }

      &__label {
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-semibold);
        line-height: var(--line-height-150);
      }
    }
  `,
  template: `
    <label class="image-upload">
      <input
        accept="image/jpeg,image/png,image/webp"
        class="image-upload__input"
        type="file"
        [attr.aria-label]="accessibleLabel()"
        (change)="onFileSelected($event)"
      />

      <span
        class="image-upload__tile"
        [class.image-upload__tile--preview]="hasPreview()"
      >
        @if (previewUrl(); as preview) {
          <img alt="" class="image-upload__preview" [src]="preview" />
          <span aria-hidden="true" class="image-upload__overlay"></span>
        }

        <span aria-hidden="true" class="image-upload__icon"></span>
        <span class="image-upload__label">{{ actionLabel() }}</span>
      </span>
    </label>
  `,
})
export class ImageUploadComponent implements OnDestroy {
  private readonly localPreviewUrl = signal<string | null>(null);
  private objectUrl: string | null = null;

  public readonly imageUrl = input<string | null>(null);
  public readonly imageSelected = output<File>();

  protected readonly previewUrl = computed(
    () => this.localPreviewUrl() ?? this.imageUrl(),
  );
  protected readonly hasPreview = computed(() => this.previewUrl() !== null);
  protected readonly actionLabel = computed(() =>
    this.hasPreview() ? 'Change Image' : '+ Upload Image',
  );
  protected readonly accessibleLabel = computed(() =>
    this.hasPreview() ? 'Change image' : 'Upload image',
  );

  public ngOnDestroy(): void {
    this.revokeObjectUrl();
  }

  protected onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.item(0);

    if (!file) {
      return;
    }

    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.localPreviewUrl.set(this.objectUrl);
    this.imageSelected.emit(file);
  }

  private revokeObjectUrl(): void {
    if (!this.objectUrl) {
      return;
    }

    URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null;
  }
}
