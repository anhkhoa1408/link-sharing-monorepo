import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PreviewTagComponent } from '../../../molecules/preview-tag/preview-tag.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PreviewTagComponent],
  selector: 'app-phone-preview',
  template: `
    <section aria-label="Profile preview" class="phone-preview">
      <div aria-hidden="true" class="phone-preview__notch"></div>

      <div class="phone-preview__content">
        <div class="phone-preview__profile">
          <div aria-hidden="true" class="phone-preview__avatar"></div>
          <div class="phone-preview__identity">
            <div aria-hidden="true" class="phone-preview__name"></div>
            <div aria-hidden="true" class="phone-preview__description"></div>
          </div>
        </div>

        <div class="phone-preview__links">
          <div class="phone-preview__tag">
            <app-preview-tag
              platform="GITHUB"
              url="https://github.com/johnappleseed"
            />
          </div>
          <div class="phone-preview__tag">
            <app-preview-tag
              platform="YOUTUBE"
              url="https://youtube.com/benwright"
            />
          </div>
          <div class="phone-preview__tag">
            <app-preview-tag
              platform="LINKEDIN"
              url="https://linkedin.com/in/johnappleseed"
            />
          </div>
          <div aria-hidden="true" class="phone-preview__placeholder"></div>
          <div aria-hidden="true" class="phone-preview__placeholder"></div>
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

      &__avatar {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        background: var(--color-grey-100);
      }

      &__identity {
        display: flex;
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
export class PhonePreviewComponent {}
