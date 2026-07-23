import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { PreviewLink } from '../../core/models/preview-link.model';
import { PreviewTagComponent } from '../../molecules/preview-tag/preview-tag.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PreviewTagComponent],
  selector: 'app-phone-preview',
  template: `
    <section aria-label="Profile preview" class="phone-preview">
      <div aria-hidden="true" class="phone-preview__notch"></div>

      <div class="phone-preview__content">
        <div class="phone-preview__profile">
          @if (avatarUrl(); as avatar) {
            <img alt="" class="phone-preview__avatar-image" [src]="avatar" />
          } @else {
            <div aria-hidden="true" class="phone-preview__avatar"></div>
          }

          <div class="phone-preview__identity">
            @if (fullName(); as name) {
              <p class="phone-preview__name-text">{{ name }}</p>
            } @else {
              <div aria-hidden="true" class="phone-preview__name"></div>
            }

            @if (email(); as profileEmail) {
              <p class="phone-preview__email">{{ profileEmail }}</p>
            } @else {
              <div aria-hidden="true" class="phone-preview__description"></div>
            }
          </div>
        </div>

        <div class="phone-preview__links">
          @for (link of links(); track link.id) {
            <div class="phone-preview__tag">
              <app-preview-tag [platform]="link.platform" [url]="link.url" />
            </div>
          }

          @for (slot of placeholderSlots(); track slot) {
            <div aria-hidden="true" class="phone-preview__placeholder"></div>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .phone-preview {
      position: relative;
      width: 307px;
      height: 631px;
      padding: 10px;
      border: 1px solid var(--color-grey-500);
      border-radius: 42px;
      background: var(--color-white);

      &::before {
        position: absolute;
        inset: 9px;
        border: 1px solid var(--color-grey-500);
        border-radius: 34px;
        content: '';
        pointer-events: none;
      }

      &__notch {
        position: absolute;
        z-index: 2;
        top: 9px;
        left: 50%;
        width: 90px;
        height: 20px;
        border: 1px solid var(--color-grey-500);
        border-top: 0;
        border-radius: 0 0 12px 12px;
        background: var(--color-white);
        transform: translateX(-50%);
      }

      &__content {
        position: relative;
        z-index: 1;
        display: flex;
        width: 237px;
        flex-direction: column;
        gap: var(--spacing-700);
        margin: 53px auto 0;
      }

      &__profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 25px;
      }

      &__avatar,
      &__avatar-image {
        width: 96px;
        height: 96px;
        border-radius: 50%;
      }

      &__avatar {
        background: var(--color-grey-100);
      }

      &__avatar-image {
        border: 4px solid var(--color-purple-600);
        object-fit: cover;
      }

      &__identity {
        display: flex;
        max-width: 100%;
        flex-direction: column;
        align-items: center;
        gap: 13px;
      }

      &__name,
      &__description,
      &__placeholder {
        border-radius: 104px;
        background: var(--color-grey-100);
      }

      &__name {
        width: 160px;
        height: 16px;
      }

      &__description {
        width: 72px;
        height: 8px;
      }

      &__name-text,
      &__email {
        max-width: 100%;
        margin: 0;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__name-text {
        color: var(--color-grey-900);
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-semibold);
        line-height: var(--line-height-150);
      }

      &__email {
        color: var(--color-grey-500);
        font-size: var(--font-size-12);
        font-weight: var(--font-weight-regular);
        line-height: var(--line-height-150);
      }

      &__links {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      &__tag {
        width: 237px;
        height: 44px;

        app-preview-tag {
          display: block;
          width: 127.3%;
          transform: scale(0.7857);
          transform-origin: top left;
        }
      }

      &__placeholder {
        width: 100%;
        height: 44px;
        border-radius: 8px;
      }
    }
  `,
})
export class PhonePreviewComponent {
  public readonly firstName = input<string | null>(null);
  public readonly lastName = input<string | null>(null);
  public readonly email = input<string | null>(null);
  public readonly avatarUrl = input<string | null>(null);
  public readonly links = input<readonly PreviewLink[]>([]);

  protected readonly fullName = computed(() => {
    const name = [this.firstName(), this.lastName()]
      .filter((part): part is string => Boolean(part?.trim()))
      .join(' ');

    return name || null;
  });
  protected readonly placeholderSlots = computed(() =>
    Array.from(
      { length: Math.max(0, 5 - this.links().length) },
      (_, index) => index,
    ),
  );
}
