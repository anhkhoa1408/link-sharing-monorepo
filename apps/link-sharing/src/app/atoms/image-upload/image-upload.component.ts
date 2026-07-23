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
