# SCSS Conventions

## Component Styles

- Use inline SCSS in the Angular component `styles` property for page and component-specific styles.
- Pages must use inline SCSS in their component `styles` property.
- Keep reusable button and input atom styles in `apps/link-sharing/src/assets/scss/_button.scss` and `apps/link-sharing/src/assets/scss/_input.scss`, and load them through `apps/link-sharing/src/assets/scss/index.scss`.
- Do not root global atom styles under custom element selectors such as `app-button` or `app-input`.
- When styling Angular Material controls, anchor rules to the Material control and its explicit semantic class, for example `.button.mat-mdc-button-base`, and prefer Angular Material theming APIs and tokens over assumptions about internal DOM structure.
- Use `:host` only for inline, component-scoped host layout when it is genuinely required; do not use it as the root of shared button or input styles.
- Use BEM class names for component styles.
- Use SCSS nesting and the `&` operator when they make related selectors, BEM elements, modifiers, or states clearer.
- Avoid deep nesting; keep each selector and BEM block independently understandable.

## Template Styling

- Avoid inline CSS in templates, including `style` attributes and style bindings; place styling rules in the component's inline SCSS instead.
- For conditional classes, use a direct class binding such as `[class.active]="isActive()"`; do not use `NgClass` when toggling individual classes.

## Atomic Design Styling Responsibilities

- `atoms` own only the styles required by the smallest reusable UI primitive. Shared button and input atom styles belong in `assets/scss`.
- `molecules` own the layout and state styles needed to compose their atoms into one focused control.
- `organisms` own the section-level layout that coordinates their atoms and molecules.
- `templates` own reusable page-shell and layout styles, not route-specific visual behavior.
- `pages` own route-specific layout and presentation styles and must keep those styles inline in the page component.
