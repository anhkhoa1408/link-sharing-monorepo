import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../atoms/button/button.component';
import { AuthService } from '../../../core/auth.service';
import { TabButtonComponent } from '../../../molecules/tab-button/tab-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, NgOptimizedImage, TabButtonComponent],
  selector: 'app-home-header',
  template: `
    <header class="home-header">
      <div class="home-header__logo">
        <img
          alt="Devlinks"
          height="32"
          ngSrc="/images/logo-devlinks-large.svg"
          priority
          width="146"
        />
      </div>

      <nav aria-label="Main navigation" class="home-header__navigation">
        <app-tab-button icon="link" label="Links" [active]="true" />
        <app-tab-button icon="profile" label="Profile Details" />
      </nav>

      <div class="home-header__actions">
        <app-button
          class="home-header__action"
          variant="secondary"
          (click)="onLogout()"
        >
          Logout
        </app-button>
        <app-button class="home-header__action" variant="secondary">
          Preview
        </app-button>
      </div>
    </header>
  `,
  styles: `
    :host {
      display: block;
    }

    .home-header {
      position: relative;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-200) var(--spacing-200) var(--spacing-200)
        var(--spacing-300);
      border-radius: 12px;
      background: var(--color-white);

      &__logo {
        width: 146px;
        height: 32px;
        flex: 0 0 146px;
        overflow: hidden;

        img {
          display: block;
          max-width: none;
        }
      }

      &__navigation {
        position: absolute;
        left: 50%;
        display: flex;
        align-items: center;
        gap: var(--spacing-200);
        transform: translateX(-50%);
      }

      &__actions {
        display: flex;
        gap: var(--spacing-200);
      }

      &__action {
        display: block;
        min-width: 108px;
      }
    }

    @media (width < 900px) {
      .home-header {
        display: grid;
        grid-template-columns: 32px minmax(0, 1fr) auto;
        gap: var(--spacing-100);
        padding: var(--spacing-200);

        &__logo {
          width: 32px;
          flex-basis: 32px;
        }

        &__navigation {
          position: static;
          gap: 0;
          justify-self: center;
          transform: none;
        }
      }
    }

    @media (width < 600px) {
      .home-header {
        &__actions {
          gap: var(--spacing-100);
        }

        &__action {
          min-width: 0;
        }
      }
    }
  `,
})
export class HomeHeaderComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  public onLogout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
