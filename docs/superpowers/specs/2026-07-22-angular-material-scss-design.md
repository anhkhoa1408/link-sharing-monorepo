# Angular Material SCSS Integration Design

## Goal

Install Angular Material for the `link-sharing` Angular application and establish a maintainable SCSS-based customization layer without applying a prebuilt theme or changing any existing screen.

## Dependencies

- Add `@angular/material` and `@angular/cdk` at the same Angular major/version line used by the workspace.
- Add only animation support required by the Angular Material schematic and the application's standalone bootstrap configuration.
- Use npm, matching the workspace lockfile.

## Styling architecture

- Create `apps/link-sharing/src/assets/scss/_material-theme.scss` as the single global Angular Material theme entry point.
- Load Angular Material through its public Sass API (`@use '@angular/material' as mat`).
- Emit Material core and base component theme styles once.
- Keep component-specific overrides in this file, grouped by component and implemented through Angular Material's public Sass override mixins where available.
- Import the Material theme from `apps/link-sharing/src/styles.scss` after the existing design tokens and before general application utilities when ordering affects the cascade.
- Do not import a prebuilt theme and do not target Angular Material's private DOM classes.

## Design-token relationship

The existing color and typography tokens remain the application's source of truth. Component overrides may reference those SCSS/CSS custom properties. This installation creates the override boundary but does not invent component-specific colors, sizes, or spacing until a component is introduced and its intended design is known.

## Runtime integration

The Angular Material schematic may update the standalone application configuration and document shell for required providers or assets. Any schematic changes will be reviewed before acceptance. No Material component will be added to the application during this task.

## Failure handling

- Run the generator in dry-run mode before applying it.
- Reject unexpected modifications outside dependency metadata, global styling, the application bootstrap configuration, and document shell.
- If the official generator is incompatible with Angular 22 or Nx, install the matching packages and reproduce only the necessary configuration manually.

## Verification

- Run Nx formatting for changed files.
- Run the `link-sharing` build, lint, test, and typecheck targets through the workspace's npm-prefixed Nx CLI.
- Confirm no prebuilt Material theme is registered and the global SCSS theme compiles.

## Out of scope

- Adding or redesigning UI components.
- Defining per-component visual tokens without a concrete component design.
- Dark-mode implementation.
