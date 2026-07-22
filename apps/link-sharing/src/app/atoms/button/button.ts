import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatButton, type MatButtonAppearance } from '@angular/material/button';

export type ButtonVariant = 'primary' | 'secondary';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
  selector: 'app-button',
  templateUrl: './button.html',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input(false);

  protected readonly appearance = computed<MatButtonAppearance>(() =>
    this.variant() === 'primary' ? 'filled' : 'outlined',
  );

  protected readonly buttonClass = computed(
    () => `button button--${this.variant()}`,
  );
}
