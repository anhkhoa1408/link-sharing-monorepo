import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  selector: 'app-auth-template',
  styles: `
    :host {
      display: block;
      min-height: 100dvh;

      .auth-template {
        display: grid;
        min-height: 100dvh;
        padding: var(--spacing-500) var(--spacing-300);
        place-items: center;
        background: var(--color-grey-50);

        &__container {
          display: flex;
          width: min(100%, 476px);
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-600);
        }

        &__logo {
          width: 183px;
          height: 40px;
        }

        &__card {
          display: flex;
          width: 100%;
          flex-direction: column;
          gap: var(--spacing-500);
          padding: var(--spacing-500);
          border-radius: 12px;
          background: var(--color-white);
        }

        &__header {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-100);
        }

        &__title,
        &__description {
          margin: 0;
        }

        &__title {
          color: var(--color-grey-900);
          font-size: var(--font-size-32);
          font-weight: var(--font-weight-bold);
          line-height: var(--line-height-150);
        }

        &__description {
          color: var(--color-grey-500);
          font-size: var(--font-size-16);
          font-weight: var(--font-weight-regular);
          line-height: var(--line-height-150);
        }
      }

      @media (width < 600px) {
        .auth-template {
          padding: var(--spacing-400) var(--spacing-300);
          place-items: start center;

          &__container {
            align-items: flex-start;
            gap: var(--spacing-600);
          }

          &__card {
            gap: var(--spacing-500);
            padding: 0;
            background: transparent;
          }

          &__title {
            font-size: var(--font-size-24);
          }
        }
      }
    }
  `,
  template: `
    <main class="auth-template">
      <div class="auth-template__container">
        <img
          alt="Devlinks"
          class="auth-template__logo"
          height="40"
          ngSrc="images/logo-devlinks-large.svg"
          priority
          width="183"
        />

        <section class="auth-template__card" aria-labelledby="auth-title">
          <header class="auth-template__header">
            <h1 class="auth-template__title" id="auth-title">
              {{ title() }}
            </h1>
            <p class="auth-template__description">{{ description() }}</p>
          </header>

          <ng-content />
        </section>
      </div>
    </main>
  `,
})
export class AuthTemplateComponent {
  public readonly title = input.required<string>();
  public readonly description = input.required<string>();
}
