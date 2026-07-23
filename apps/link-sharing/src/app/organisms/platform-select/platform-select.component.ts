import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';
import { MatOption } from '@angular/material/core';
import {
  MatSelect,
  type MatSelectChange,
  MatSelectTrigger,
} from '@angular/material/select';
import {
  PLATFORM_VALUES,
  type Platform,
} from '@link-sharing/shared-models';

import {
  PLATFORM_PRESENTATION,
  type PlatformPresentation,
} from '../../core/constants/platform-presentation.constant';

interface PlatformOption extends PlatformPresentation {
  readonly value: Platform;
}

const PLATFORM_OPTIONS: readonly PlatformOption[] = PLATFORM_VALUES.map(
  (value) => ({ value, ...PLATFORM_PRESENTATION[value] }),
);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatOption, MatSelect, MatSelectTrigger],
  selector: 'app-platform-select',
  template: `
    <div class="platform-select">
      <mat-select
        class="platform-select__control"
        panelWidth="auto"
        [attr.aria-invalid]="invalid()"
        [aria-label]="ariaLabel()"
        [canSelectNullableOptions]="true"
        [disabled]="disabled()"
        [disableRipple]="true"
        [disableOptionCentering]="true"
        [hideSingleSelectionIndicator]="true"
        [panelClass]="'platform-select-panel'"
        [required]="required()"
        [value]="value()"
        (blur)="touch.emit()"
        (openedChange)="isOpen.set($event)"
        (selectionChange)="onSelectionChange($event)"
      >
        <mat-select-trigger>
          <span class="platform-select__visual">
            @if (selectedOption(); as selected) {
              <svg
                aria-hidden="true"
                class="platform-select__icon"
                [attr.viewBox]="selected.icon.viewBox"
              >
                <path [attr.d]="selected.icon.path" fill="currentColor" />
              </svg>
              <span class="platform-select__label">{{ selected.label }}</span>
            } @else {
              <svg
                aria-hidden="true"
                class="platform-select__icon"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="M6.114 10.829 5.17 11.77a2.667 2.667 0 0 1-3.771-3.77l1.885-1.886a2.667 2.667 0 0 1 3.772 0M9.886 5.171l.943-.942A2.667 2.667 0 0 1 14.6 8l-1.885 1.886a2.667 2.667 0 0 1-3.772 0M5.643 10.357l4.714-4.714"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.75"
                />
              </svg>
              <span class="platform-select__label">{{ placeholder() }}</span>
            }

            <svg
              aria-hidden="true"
              class="platform-select__chevron"
              [class.platform-select__chevron--open]="isOpen()"
              fill="none"
              viewBox="0 0 12 6"
            >
              <path
                d="m1 1 5 4 5-4"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </span>
        </mat-select-trigger>

        <mat-option
          class="platform-select-option platform-select-option--placeholder"
          [value]="null"
          disabled
        >
          {{ placeholder() }}
        </mat-option>

        @for (option of options; track option.value) {
          <mat-option
            class="platform-select-option"
            [value]="option.value"
          >
            <span class="platform-select-option__content">
              <svg
                aria-hidden="true"
                class="platform-select-option__icon"
                [attr.viewBox]="option.icon.viewBox"
              >
                <path [attr.d]="option.icon.path" fill="currentColor" />
              </svg>
              <span class="platform-select-option__label">
                {{ option.label }}
              </span>
            </span>
          </mat-option>
        }
      </mat-select>
    </div>
  `,
  styles: `
    .platform-select {
      position: relative;
      width: 100%;

      &__control.mat-mdc-select {
        width: 100%;
        min-height: 58px;
        padding: var(--spacing-200);
        overflow: hidden;
        border: 1px solid var(--color-grey-200);
        border-radius: 8px;
        background: var(--color-white);
        color: var(--color-grey-900);

        &:focus-within,
        &.mat-mdc-select-open {
          border-color: var(--color-purple-600);
          outline: 0;
          box-shadow: 0 0 32px rgb(99 60 255 / 25%);
        }

        &[aria-disabled='true'] {
          opacity: 0.5;
        }

        .mat-mdc-select-trigger {
          min-height: 24px;
        }

        .mat-mdc-select-arrow-wrapper {
          display: none;
        }
      }

      &__visual {
        display: flex;
        width: 100%;
        min-width: 0;
        align-items: center;
        gap: var(--spacing-200);
        color: var(--color-grey-900);
        font-family: 'Instrument Sans', sans-serif;
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-regular);
        line-height: var(--line-height-150);
      }

      &__label {
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &__icon {
        width: 16px;
        height: 16px;
        flex: 0 0 16px;
        color: var(--color-grey-500);
      }

      &__chevron {
        width: 12px;
        height: 6px;
        flex: 0 0 12px;
        color: var(--color-purple-600);
        transition: transform 120ms ease;

        &--open {
          transform: rotate(180deg);
        }
      }
    }

    .platform-select-panel.mat-mdc-select-panel {
      display: flex;
      max-height: min(798px, calc(100vh - 32px));
      flex-direction: column;
      padding: var(--spacing-200);
      overflow-y: auto;
      border: 1px solid var(--color-grey-200);
      border-radius: 8px;
      background: var(--color-white);
      box-shadow: 0 0 32px rgb(0 0 0 / 10%);

      .mat-mdc-option.platform-select-option {
        min-height: 24px;
        padding: 0;
        background: var(--color-white);
        color: var(--color-grey-900);
        font-family: 'Instrument Sans', sans-serif;
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-regular);
        line-height: var(--line-height-150);

        &:not(:last-child) {
          padding-bottom: var(--spacing-200);
          margin-bottom: var(--spacing-200);
          border-bottom: 1px solid var(--color-grey-200);
        }

        &:hover,
        &.mdc-list-item--selected {
          background: var(--color-white);
        }

        &.mat-mdc-option-active:not(.mdc-list-item--selected) {
          outline: 2px solid var(--color-purple-600);
          outline-offset: -2px;
          background: var(--color-grey-50);
        }

        &.mdc-list-item--selected {
          color: var(--color-purple-600);
        }

        .mat-pseudo-checkbox,
        .mat-mdc-option-ripple {
          display: none;
        }
      }

      .platform-select-option {
        &--placeholder {
          display: none;
        }

        &__content {
          display: flex;
          width: 100%;
          min-width: 0;
          align-items: center;
          gap: 12px;
        }

        &__icon {
          width: 16px;
          height: 16px;
          flex: 0 0 16px;
          color: var(--color-grey-500);
        }

        &__label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .mat-mdc-option.platform-select-option.mdc-list-item--selected
        .platform-select-option__icon {
        color: var(--color-purple-600);
      }
    }
  `,
})
export class PlatformSelectComponent
  implements FormValueControl<Platform | null>
{
  private readonly select = viewChild.required(MatSelect);

  public readonly value = model.required<Platform | null>();
  public readonly ariaLabel = input.required<string>();
  public readonly placeholder = input('Select a platform');
  public readonly disabled = input(false);
  public readonly required = input(false);
  public readonly invalid = input(false);
  public readonly touch = output<void>();

  protected readonly options = PLATFORM_OPTIONS;
  protected readonly isOpen = signal(false);
  protected readonly selectedOption = computed(() => {
    const value = this.value();
    return value === null ? null : PLATFORM_PRESENTATION[value];
  });

  public focus(options?: FocusOptions): void {
    this.select().focus(options);
  }

  protected onSelectionChange(
    event: MatSelectChange<Platform | null>,
  ): void {
    this.value.set(event.value);
  }
}
