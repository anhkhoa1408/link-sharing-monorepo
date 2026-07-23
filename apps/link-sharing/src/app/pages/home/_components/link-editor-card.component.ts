import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import type { Field } from '@angular/forms/signals';
import type { Platform } from '@link-sharing/shared-models';
import { InputComponent } from '../../../atoms/input/input.component';
import { PlatformSelectComponent } from '../../../organisms/platform-select/platform-select.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponent, PlatformSelectComponent],
  selector: 'app-link-editor-card',
  template: `
    <article class="link-card">
      <header class="link-card__header">
        <h2 class="link-card__title">
          <span aria-hidden="true" class="link-card__handle">
            <span></span>
            <span></span>
          </span>
          Link #{{ index() }}
        </h2>
        <button class="link-card__remove" type="button">Remove</button>
      </header>

      <div class="link-card__field">
        <span class="link-card__label" [id]="platformLabelId()">Platform</span>
        <app-platform-select
          [ariaLabel]="'Platform for link ' + index()"
          [value]="platform()"
          (valueChange)="platform.set($event)"
        />
      </div>

      <label class="link-card__field" [for]="urlInputId()">
        <span class="link-card__label">Link</span>
        <app-input
          [ariaLabel]="'URL for link ' + index()"
          [formField]="urlField()"
          [inputId]="urlInputId()"
          icon="link"
          type="url"
        />
      </label>
    </article>
  `,
  styles: `
    :host {
      display: block;
    }

    .link-card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-200);
      padding: var(--spacing-300);
      border-radius: 12px;
      background: var(--color-grey-50);

      &__header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      &__title,
      &__remove,
      &__label {
        font-family: 'Instrument Sans', sans-serif;
        line-height: var(--line-height-150);
      }

      &__title {
        display: flex;
        align-items: center;
        gap: var(--spacing-100);
        margin: 0;
        color: var(--color-grey-500);
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-bold);
      }

      &__handle {
        display: flex;
        width: 12px;
        flex-direction: column;
        gap: 4px;

        span {
          width: 12px;
          height: 1px;
          background: currentColor;
        }
      }

      &__remove {
        min-height: 24px;
        padding: 0;
        border: 0;
        background: transparent;
        color: var(--color-grey-500);
        cursor: pointer;
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-regular);

        &:hover {
          color: var(--color-purple-600);
        }

        &:focus-visible {
          border-radius: 2px;
          outline: 2px solid var(--color-purple-600);
          outline-offset: 3px;
        }
      }

      &__field {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-100);
      }

      &__label {
        color: var(--color-grey-900);
        font-size: var(--font-size-12);
        font-weight: var(--font-weight-regular);
      }
    }

    @media (width < 600px) {
      .link-card {
        padding: var(--spacing-200);
      }
    }
  `,
})
export class LinkEditorCardComponent {
  public readonly index = input.required<number>();
  public readonly platform = model.required<Platform | null>();
  public readonly urlField = input.required<Field<string>>();

  protected readonly platformLabelId = computed(
    () => `home-link-${this.index()}-platform-label`,
  );
  protected readonly urlInputId = computed(
    () => `home-link-${this.index()}-url`,
  );
}
