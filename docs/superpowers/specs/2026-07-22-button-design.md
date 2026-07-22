# Button Component Design

## Goal

Add a reusable Angular Material button atom matching the supplied Figma primary and secondary button designs.

## Files

- `apps/link-sharing/src/app/atoms/button/button.ts` contains the standalone component and its inline template.
- `apps/link-sharing/src/assets/scss/_button.scss` contains the global button override, imported by `apps/link-sharing/src/assets/scss/index.scss`.
- No external button HTML template or committed component spec is included: the application convention requires inline templates and prohibits `*.spec.ts` files.

## Component API

- Location: `apps/link-sharing/src/app/atoms/button/`
- Class: `Button`
- Selector: `app-button`
- Standalone Angular component using `ChangeDetectionStrategy.OnPush`
- `variant` signal input accepts `'primary' | 'secondary'` and defaults to `'primary'`
- `disabled` boolean signal input defaults to `false`
- Consumer-provided label is projected with `ng-content`

Example:

```html
<app-button>Save</app-button>
<app-button variant="secondary" [disabled]="true">Cancel</app-button>
```

## Implementation

The component imports Angular Material's standalone `MatButton`. TypeScript computes the Material appearance and CSS class from `variant`; the template contains bindings only and no conditional logic. The rendered control uses Material's filled appearance for primary and outlined appearance for secondary, preserving Material keyboard, focus, ripple, and disabled behavior.

The button fills its host width. Its consumer controls final width through the containing layout.

## Styling

Global overrides live in `apps/link-sharing/src/assets/scss/_button.scss`. `apps/link-sharing/src/assets/scss/index.scss` loads this partial. Since global `styles.scss` loads `material-theme` before `scss/index`, button overrides are emitted after the default Angular Material theme.

Rules are scoped beneath `app-button .button` so other Material buttons are unaffected.

Figma values:

- Width: `100%`
- Padding: `16px 24px`
- Border radius: `8px`
- Typography: Instrument Sans, 16px, 600 weight, 1.5 line height
- Primary default: purple `#633cff`, white text
- Primary hover/active: hover purple `#beadff`, shadow `0 0 16px rgb(99 60 255 / 25%)`
- Secondary default: transparent background, purple border and text
- Secondary hover/active: light-purple `#efebff` background
- Disabled: Material-disabled behavior plus Figma's 25% visual opacity

Existing CSS custom properties are used where matching tokens exist. Light purple is kept local to the button partial because no shared token currently exists.

## Tests

The transient TDD specification used while developing this atom was removed before the final tree because the repository convention prohibits `*.spec.ts` files in `apps/link-sharing`.

Final verification uses Nx lint, typecheck, and build targets. The broader requested command also runs the existing app test target:

```bash
npm exec -- nx run-many -t test,lint,typecheck,build -p link-sharing
```

## Scope

No loading state, icon API, click wrapper, link mode, size variants, or shared Nx library is added.
