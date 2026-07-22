import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { type Field, FormField } from '@angular/forms/signals';

export type InputType =
  'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';
export type InputIcon = 'email' | 'link' | 'password';

let nextInputId = 0;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
  selector: 'app-input',
  styles: `
    :host {
      display: block;
      width: 100%;

      .input {
        display: flex;
        width: 100%;
        flex-direction: column;
        gap: var(--spacing-100);

        &__control {
          display: flex;
          align-items: center;
          gap: var(--spacing-200);
          padding: var(--spacing-200);
          overflow: hidden;
          border: 1px solid var(--color-grey-200);
          border-radius: 8px;
          background: var(--color-white);

          &:focus-within {
            border-color: var(--color-purple-600);
            box-shadow: 0 0 32px rgb(99 60 255 / 25%);
          }
        }

        &__icon {
          width: 16px;
          height: 16px;
          flex: 0 0 16px;
          color: var(--color-grey-500);
        }

        &__native {
          width: 100%;
          min-width: 0;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--color-grey-900);
          font-family: 'Instrument Sans', sans-serif;
          font-size: var(--font-size-16);
          font-weight: var(--font-weight-regular);
          line-height: var(--line-height-150);

          &::placeholder {
            color: rgb(51 51 51 / 50%);
            opacity: 1;
          }

          &[type='number'] {
            appearance: textfield;
            -moz-appearance: textfield;
          }

          &[type='number']::-webkit-inner-spin-button,
          &[type='number']::-webkit-outer-spin-button {
            margin: 0;
            appearance: none;
            -webkit-appearance: none;
          }
        }

        &__error {
          margin: 0;
          color: var(--color-red-500);
          font-family: 'Instrument Sans', sans-serif;
          font-size: var(--font-size-12);
          font-weight: var(--font-weight-regular);
          line-height: var(--line-height-150);
        }

        &--error {
          .input__control {
            border-color: var(--color-red-500);
            box-shadow: none;

            &:focus-within {
              box-shadow: 0 0 32px rgb(255 57 57 / 25%);
            }
          }

          .input__native {
            color: var(--color-red-500);
          }
        }
      }
    }
  `,
  template: `
    <div class="input" [class.input--error]="isError()">
      <div class="input__control">
        @switch (icon()) {
          @case ('email') {
            <svg
              aria-hidden="true"
              class="input__icon"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M14 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1.1 2L8 8.37 3.1 5h9.8ZM3 11V6.43l4.43 3.05a1 1 0 0 0 1.14 0L13 6.43V11H3Z"
              />
            </svg>
          }
          @case ('password') {
            <svg
              aria-hidden="true"
              class="input__icon"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M12.5 6H12V4a4 4 0 0 0-8 0v2h-.5A1.5 1.5 0 0 0 2 7.5v6A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 12.5 6ZM6 4a2 2 0 0 1 4 0v2H6V4Zm3 7.73V13H7v-1.27a2 2 0 1 1 2 0Z"
              />
            </svg>
          }
          @default {
            <svg
              aria-hidden="true"
              class="input__icon"
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
          }
        }

        <input
          [id]="inputId()"
          [attr.aria-describedby]="describedBy()"
          [attr.aria-invalid]="isError()"
          [attr.aria-label]="ariaLabel()"
          [attr.max]="max()"
          [attr.min]="min()"
          [formField]="formField()"
          [placeholder]="placeholder()"
          [type]="type()"
          class="input__native"
        />
      </div>

      @if (isError() && errorMessage()) {
        <p class="input__error" [id]="errorId">{{ errorMessage() }}</p>
      }
    </div>
  `,
})
export class InputComponent<T extends string | number | null> {
  private readonly instanceId = nextInputId++;

  public readonly formField = input.required<Field<T>>();
  public readonly inputId = input(`app-input-${this.instanceId}`);
  public readonly placeholder = input('');
  public readonly icon = input<InputIcon>('link');

  /** Pair `number` with a `Field<number | null>`; other types use `Field<string>`. */
  public readonly type = input<InputType>('text');
  public readonly min = input<string | number | null>(null);
  public readonly max = input<string | number | null>(null);
  public readonly ariaLabel = input.required<string>();
  public readonly isError = input(false);
  public readonly errorMessage = input('');

  protected readonly errorId = `app-input-error-${this.instanceId}`;
  protected readonly describedBy = computed(() =>
    this.isError() && this.errorMessage() ? this.errorId : null,
  );
}
