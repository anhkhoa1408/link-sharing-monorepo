import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { Platform } from '@link-sharing/shared-models';

import { PLATFORM_PRESENTATION } from '../../core/constants/platform-presentation.constant';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-preview-tag',
  template: `
    <a
      [class]="tagClass()"
      [href]="url()"
      rel="noopener noreferrer"
      target="_blank"
    >
      @if (platform() === 'FRONTEND_MENTOR') {
        <svg
          aria-hidden="true"
          class="preview-tag__platform-icon preview-tag__platform-icon--frontend-mentor"
          viewBox="0 0 24 24"
        >
          <path
            class="preview-tag__frontend-mentor-primary"
            d="M12.17 1.272a.73.73 0 0 0-.718.732v13.914a.73.73 0 0 0 .732.732.73.73 0 0 0 .732-.732V2.004a.73.73 0 0 0-.745-.732M.746 10.472a.732.732 0 0 0-.722.915c1.736 6.677 7.775 11.341 14.683 11.341a.732.732 0 0 0 0-1.464A13.706 13.706 0 0 1 1.44 11.02a.73.73 0 0 0-.694-.547"
          />
          <path
            class="preview-tag__frontend-mentor-accent"
            d="M23.246 5.44a.7.7 0 0 0-.277.063l-6.282 2.804a.733.733 0 0 0 0 1.336l6.282 2.814a.7.7 0 0 0 .3.064.732.732 0 0 0 .297-1.4L18.78 8.976l4.786-2.137a.734.734 0 0 0 .37-.966.73.73 0 0 0-.69-.433"
          />
        </svg>
      } @else {
        <svg
          aria-hidden="true"
          class="preview-tag__platform-icon"
          [attr.viewBox]="iconPresentation().icon.viewBox"
        >
          <path [attr.d]="iconPresentation().icon.path" fill="currentColor" />
        </svg>
      }

      <span class="preview-tag__label">{{ presentation().label }}</span>

      <svg
        aria-hidden="true"
        class="preview-tag__arrow"
        fill="none"
        viewBox="0 0 16 16"
      >
        <path
          d="M3.333 8h9.334m-4-4 4 4-4 4"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
        />
      </svg>
    </a>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .preview-tag {
      display: flex;
      align-items: center;
      width: 100%;
      min-width: 0;
      height: 56px;
      padding: var(--spacing-200);
      gap: var(--spacing-100);
      border: 0;
      border-radius: 8px;
      background: var(--color-grey-950);
      color: var(--color-white);
      font-family: 'Instrument Sans', sans-serif;
      font-size: var(--font-size-16);
      font-weight: var(--font-weight-regular);
      line-height: var(--line-height-150);
      letter-spacing: 0;
      text-decoration: none;
      transition: filter 150ms ease;

      &:hover {
        filter: brightness(0.92);
      }

      &:focus-visible {
        outline: 2px solid var(--color-purple-600);
        outline-offset: 3px;
      }

      &--frontend-mentor {
        border: 1px solid var(--color-grey-200);
        background: var(--color-white);
        color: var(--color-grey-900);

        .preview-tag__arrow {
          color: var(--color-grey-500);
        }
      }

      &--twitter {
        background: var(--color-blue-400);
      }

      &--linkedin {
        background: var(--color-blue-500);
      }

      &--youtube {
        background: var(--color-red-550);
      }

      &--facebook {
        background: var(--color-blue-700);
      }

      &--twitch {
        background: var(--color-pink-500);
      }

      &--dev-to {
        background: var(--color-grey-900);
      }

      &--codewars {
        background: var(--color-pink-900);
      }

      &--free-code-camp {
        background: var(--color-purple-950);
      }

      &--gitlab {
        background: var(--color-orange-500);
      }

      &--hashnode {
        background: var(--color-blue-800);
      }

      &--stack-overflow {
        background: var(--color-orange-600);
      }

      &__platform-icon {
        width: 20px;
        height: 20px;
        flex: 0 0 auto;

        &--frontend-mentor {
          width: 22.372px;
        }
      }

      &__frontend-mentor-primary {
        fill: var(--color-frontend-mentor-primary);
      }

      &__frontend-mentor-accent {
        fill: var(--color-frontend-mentor-accent);
      }

      &--dev-to &__platform-icon,
      &--codewars &__platform-icon {
        width: 16px;
        height: 16px;
      }

      &__label {
        min-width: 0;
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__arrow {
        width: 16px;
        height: 16px;
        flex: 0 0 auto;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .preview-tag {
        transition: none;
      }
    }
  `,
})
export class PreviewTagComponent {
  public readonly platform = input.required<Platform>();
  public readonly url = input.required<string>();

  protected readonly presentation = computed(
    () => PLATFORM_PRESENTATION[this.platform()],
  );

  protected readonly iconPresentation = computed(() =>
    // Figma pairs the freeCodeCamp label with its CodePen glyph asset.
    this.platform() === 'FREE_CODE_CAMP'
      ? PLATFORM_PRESENTATION.CODEPEN
      : this.presentation(),
  );

  protected readonly tagClass = computed(
    () =>
      `preview-tag preview-tag--${this.platform().toLowerCase().replace(/_/g, '-')}`,
  );
}
