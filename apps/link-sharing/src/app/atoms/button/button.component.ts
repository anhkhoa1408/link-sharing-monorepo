import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatButton, type MatButtonAppearance } from '@angular/material/button';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonType = 'button' | 'submit';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton],
  selector: 'app-button',
  template: `
    <button
      [matButton]="appearance()"
      [class]="buttonClass()"
      [disabled]="disabled()"
      [type]="type()"
    >
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  public readonly variant = input<ButtonVariant>('primary');
  public readonly disabled = input(false);
  public readonly type = input<ButtonType>('button');

  protected readonly appearance = computed<MatButtonAppearance>(() =>
    this.variant() === 'primary' ? 'filled' : 'outlined',
  );

  protected readonly buttonClass = computed(
    () => `button button--${this.variant()}`,
  );
}
