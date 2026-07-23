import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
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
export class ImageUploadComponent {
  public readonly imageUrl = input<string | null>(null);
  public readonly imageSelected = output<File>();
  public readonly fileRejected = output<string>();

  protected readonly previewUrl = computed(() => this.imageUrl());
  protected readonly hasPreview = computed(() => this.previewUrl() !== null);
  protected readonly actionLabel = computed(() =>
    this.hasPreview() ? 'Change Image' : '+ Upload Image',
  );
  protected readonly accessibleLabel = computed(() =>
    this.hasPreview() ? 'Change image' : 'Upload image',
  );

  protected onFileSelected(event: Event): void {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.item(0);

    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      input.value = '';
      this.fileRejected.emit('Image must not exceed 5 MB.');
      return;
    }

    this.imageSelected.emit(file);
  }
}
