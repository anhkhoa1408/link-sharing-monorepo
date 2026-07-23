# SCSS Conventions

These rules govern how SCSS is authored. Follow `angular-conventions.md` for
Angular component and file-structure decisions.

## Style Scope

- Keep component-specific styles scoped to the component that owns them.
- Reserve global styles for design tokens, resets, themes, utilities, and selectors that must cross component or overlay boundaries.
- Place each global style block in a focused partial under `apps/link-sharing/src/assets/scss` and load it through `apps/link-sharing/src/assets/scss/index.scss`.
- Keep one responsibility per partial; do not place unrelated BEM blocks in the same file.
- Do not root reusable global styles under Angular custom-element selectors such as `app-button` or `app-input`.
- Use `:host` only for component-scoped host layout when the host element genuinely needs styling.

## Selectors and Nesting

- Use BEM class names for application-owned styles.
- Use SCSS nesting and `&` for elements, modifiers, pseudo-classes, and pseudo-elements when it keeps the relationship clear.
- Limit selector nesting to three levels, excluding at-rules; split selectors that become dependent on the DOM hierarchy.
- Do not use ID selectors or `!important` to increase specificity.

## Design Tokens and Values

- Use existing CSS custom-property tokens for colors, typography, spacing, and other design-system values.
- Do not duplicate an existing token as a raw literal.
- Add a token only when a value is part of the design system or has a real reusable semantic meaning; keep one-off layout dimensions local.

## Angular Material and Encapsulation

- Prefer Angular Material theming APIs and tokens over selectors that depend on internal DOM structure.
- Anchor Material overrides to both the Material control and an explicit application class, for example `.button.mat-mdc-button-base`.
- If no public theming API or token exists, target the smallest necessary Material selector and keep it scoped under an application-owned class.
- Style CDK overlay content globally through an explicit `panelClass`; do not rely on component-scoped selectors reaching the overlay container.
- Use `ViewEncapsulation.None` only when styles must cross a component boundary, and scope every resulting selector under an application-owned BEM block.

## Template Styling

- Do not use static `style` attributes in templates.
- Prefer class bindings for discrete visual states; use a style binding only for a genuinely dynamic value that cannot be represented by a class or token.
- Use a direct binding such as `[class.active]="isActive()"` for a single conditional class instead of `NgClass`.
- Do not remove a focus outline unless an equally visible `:focus-visible` treatment replaces it.
- Pair hover-only feedback with equivalent keyboard-focus feedback.
- Respect `prefers-reduced-motion` for non-essential animation and transitions.
