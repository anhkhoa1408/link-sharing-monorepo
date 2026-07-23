import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  selector: 'app-empty-links',
  template: `
    <section aria-labelledby="empty-links-title" class="empty-links">
      <div class="empty-links__content">
        <img
          alt=""
          class="empty-links__illustration"
          height="160"
          ngSrc="/images/illustration-empty-links.png"
          priority
          width="250"
        />

        <div class="empty-links__message">
          <h2 class="empty-links__title" id="empty-links-title">
            Let’s get you started
          </h2>
          <p class="empty-links__description">
            Use the “Add new link” button to get started. Once you have more
            than one link, you can reorder and edit them. We’re here to help you
            share your profiles with everyone!
          </p>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: flex;
      min-height: 0;
      flex: 1 1 auto;
    }

    .empty-links {
      display: flex;
      width: 100%;
      min-height: 0;
      flex: 1 1 auto;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-300);
      border-radius: 12px;
      background: var(--color-grey-50);

      &__content,
      &__message {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &__content {
        width: 100%;
        gap: var(--spacing-500);
      }

      &__illustration {
        width: min(250px, 100%);
        height: auto;
      }

      &__message {
        max-width: 488px;
        gap: var(--spacing-300);
        text-align: center;
      }

      &__title,
      &__description {
        margin: 0;
        font-family: 'Instrument Sans', sans-serif;
        line-height: var(--line-height-150);
      }

      &__title {
        color: var(--color-grey-900);
        font-size: var(--font-size-32);
        font-weight: var(--font-weight-bold);
      }

      &__description {
        color: var(--color-grey-500);
        font-size: var(--font-size-16);
        font-weight: var(--font-weight-regular);
      }
    }

    @media (width < 600px) {
      .empty-links {
        min-height: 420px;
        padding: var(--spacing-200);

        &__content {
          gap: var(--spacing-300);
        }

        &__message {
          gap: var(--spacing-200);
        }

        &__title {
          font-size: var(--font-size-24);
        }
      }
    }
  `,
})
export class EmptyLinksComponent {}
