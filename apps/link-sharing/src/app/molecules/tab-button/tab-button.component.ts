import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export type TabButtonIcon = 'link' | 'profile';

interface TabButtonIconDefinition {
  readonly path: string;
  readonly viewBox: string;
}

const TAB_BUTTON_ICONS = {
  link: {
    viewBox: '0 0 256 256',
    path: 'M117.18,188.74a12,12,0,0,1,0,17l-5.12,5.12A58.26,58.26,0,0,1,70.6,228h0A58.62,58.62,0,0,1,29.14,127.92L63.89,93.17a58.64,58.64,0,0,1,98.56,28.11,12,12,0,1,1-23.37,5.44,34.65,34.65,0,0,0-58.22-16.58L46.11,144.89A34.62,34.62,0,0,0,70.57,204h0a34.41,34.41,0,0,0,24.49-10.14l5.11-5.12A12,12,0,0,1,117.18,188.74ZM226.83,45.17a58.65,58.65,0,0,0-82.93,0l-5.11,5.11a12,12,0,0,0,17,17l5.12-5.12a34.63,34.63,0,1,1,49,49L175.1,145.86A34.39,34.39,0,0,1,150.61,156h0a34.63,34.63,0,0,1-33.69-26.72,12,12,0,0,0-23.38,5.44A58.64,58.64,0,0,0,150.56,180h.05a58.28,58.28,0,0,0,41.47-17.17l34.75-34.75a58.62,58.62,0,0,0,0-82.91Z',
  },
  profile: {
    viewBox: '0 0 256 256',
    path: 'M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z',
  },
} satisfies Record<TabButtonIcon, TabButtonIconDefinition>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tab-button',
  template: `
    <button
      class="tab-button"
      type="button"
      [attr.aria-pressed]="active()"
      [class.tab-button--active]="active()"
      (click)="pressed.emit()"
    >
      <svg
        aria-hidden="true"
        class="tab-button__icon"
        [attr.viewBox]="iconDefinition().viewBox"
      >
        <path [attr.d]="iconDefinition().path" fill="currentColor" />
      </svg>
      <span class="tab-button__label">{{ label() }}</span>
    </button>
  `,
  styles: `
    .tab-button {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-100);
      padding: var(--spacing-200) var(--spacing-300);
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--color-grey-500);
      cursor: pointer;
      font-family: 'Instrument Sans', sans-serif;
      font-size: var(--font-size-16);
      font-weight: var(--font-weight-semibold);
      line-height: var(--line-height-150);
      letter-spacing: 0;
      white-space: nowrap;

      &:hover,
      &--active {
        color: var(--color-purple-600);
      }

      &--active {
        background: var(--color-purple-100);
      }

      &:focus-visible {
        outline: 2px solid var(--color-purple-600);
        outline-offset: 2px;
      }

      &__icon {
        width: 20px;
        height: 20px;
        flex: 0 0 20px;
      }
    }

    @media (width < 600px) {
      .tab-button {
        padding: var(--spacing-200);

        &__label {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }
      }
    }
  `,
})
export class TabButtonComponent {
  public readonly label = input.required<string>();
  public readonly icon = input.required<TabButtonIcon>();
  public readonly active = input(false);
  public readonly pressed = output<void>();

  protected readonly iconDefinition = computed<TabButtonIconDefinition>(
    () => TAB_BUTTON_ICONS[this.icon()],
  );
}
