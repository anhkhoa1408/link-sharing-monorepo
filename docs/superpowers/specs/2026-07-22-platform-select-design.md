# Platform Select Design

## Goal

Add a reusable `platform-select` organism matching Figma nodes `22152:57`
and `22152:98`. The control uses Angular Material select behavior, integrates
with Angular Signal Forms, and supports every platform represented by the
design, including Codepen.

## Component Boundary

- Location:
  `apps/link-sharing/src/app/organisms/platform-select/platform-select.component.ts`
- Selector: `app-platform-select`
- Standalone Angular component using `ChangeDetectionStrategy.OnPush`
- Angular Material `MatSelect`, `MatOption`, and `MatSelectTrigger` own the
  overlay, keyboard navigation, focus management, ARIA listbox behavior, and
  close-on-selection behavior.
- The organism owns platform presentation, selection synchronization, and the
  section-level styling needed to match Figma.
- The component does not fetch, persist, or validate links.

## Public API And Signal Forms

The component implements `FormValueControl<Platform | null>` so consumers bind
it with Angular Signal Forms:

```html
<app-platform-select
  [formField]="linkForm.platform"
  ariaLabel="Platform"
/>
```

The public control contract is:

- `value`: required model signal of `Platform | null`
- `ariaLabel`: required accessible label
- `placeholder`: optional string with `Select a platform` as its default
- `disabled`: boolean signal input synchronized by Signal Forms
- `required`: boolean signal input synchronized by Signal Forms
- `invalid`: boolean signal input synchronized by Signal Forms
- `touch`: output emitted when focus leaves the control
- `focus(options?)`: focuses the internal Material select trigger

The parent form owns the initial value and required validation. A null value is
valid at the component boundary so forms can represent an unselected state.
The component does not introduce an error message or red visual state because
the supplied Figma nodes do not define one.

## Platform Model

Create `libs/shared-models/src/lib/link.models.ts` as the common code-level
platform contract. It exports:

- `PLATFORM_VALUES`: a readonly tuple in the Figma display order
- `Platform`: a string-literal union derived from `PLATFORM_VALUES`

The ordered values are:

1. `GITHUB`
2. `FRONTEND_MENTOR`
3. `TWITTER`
4. `LINKEDIN`
5. `YOUTUBE`
6. `FACEBOOK`
7. `TWITCH`
8. `DEV_TO`
9. `CODEWARS`
10. `CODEPEN`
11. `FREE_CODE_CAMP`
12. `GITLAB`
13. `HASHNODE`
14. `STACK_OVERFLOW`

`libs/shared-models/src/index.ts` re-exports both symbols. The frontend and API
import this contract through `@link-sharing/shared-models`; neither app imports
implementation files from the other app.

## Backend Alignment

- Add `CODEPEN` after `CODEWARS` in the Prisma `Platform` enum.
- Add a focused Prisma migration that runs
  `ALTER TYPE "Platform" ADD VALUE 'CODEPEN' AFTER 'CODEWARS';`.
- Regenerate the Prisma client only through the existing Nx Prisma target.
- Change link DTO validation from the Prisma runtime enum to
  `@IsIn(PLATFORM_VALUES)` and type DTO platform properties as shared
  `Platform`.
- Type link data, URL validation, and platform-host mapping with shared
  `Platform`.
- Add `codepen.io` to the platform-host mapping.
- Prisma remains the database schema source of truth. The shared tuple is the
  cross-application TypeScript and validation contract; the two lists must
  contain the same string values.

## Presentation

The closed trigger follows Figma node `22152:57`:

- full width of its containing block rather than a hard-coded 480px width
- 16px padding and 16px content gap
- 8px radius, white background, and grey-200 1px border
- 16px leading icon and a compact purple chevron
- Instrument Sans 16px regular text at 150% line height
- grey-900 text and grey-500 icon in the default state
- purple-600 border and `0 0 32px rgb(99 60 255 / 25%)` focus/open glow
- upward chevron while open and downward chevron while closed

The open panel follows Figma node `22152:98`:

- width tracks the trigger
- white background, grey-200 1px border, and 8px radius
- 16px panel padding and 16px vertical rhythm
- `0 0 32px rgb(0 0 0 / 10%)` shadow
- 16px brand icon, 12px icon/label gap, and 16px regular label
- 1px grey-200 divider between adjacent options, with no trailing divider
- selected label and icon use purple-600
- no Material single-selection checkmark or option ripple
- panel height is bounded by the viewport and scrolls when necessary

The trigger uses a decorative link icon while no platform is selected, then
uses the selected platform's brand icon and label. Brand SVG path metadata is
kept locally in the component file, avoiding a runtime dependency on Figma's
localhost asset server and avoiding a new icon package.

## Styling Strategy

All SCSS stays in the component's inline `styles` property as requested for
this organism. No component `.scss` file is created.

Material renders the select panel under the global CDK overlay container, so
emulated component selectors cannot reach it. The component therefore uses
`ViewEncapsulation.None`, with every rule anchored to either the component's
`.platform-select` BEM block or the explicit overlay class
`.platform-select-panel.mat-mdc-select-panel`. It does not use `::ng-deep` and
does not modify unscoped Material internals.

Existing CSS custom properties provide colors, spacing, typography sizes, and
weights. Material-specific overrides remain limited to the select and option
elements under the semantic component classes.

## Interaction And Accessibility

- A pointer click or Enter/Space opens the Material panel.
- Arrow keys move through options; Enter selects; Escape closes without a new
  selection.
- Selecting an option updates the component model signal and therefore the
  bound Signal Forms field.
- The required `ariaLabel` names the control when no external label is used.
- Disabled state is passed through to Material and prevents interaction.
- The component emits `touch` on blur, not merely when the panel closes.
- `focus()` delegates to Material so Signal Forms can focus the invalid field.
- Decorative SVGs are hidden from assistive technology; option text remains
  the accessible platform name.

## Scope And Verification

Repository rules prohibit adding tests in either application, so this work
does not create unit, integration, or end-to-end test files.

Verification consists of:

1. Prisma schema validation and client generation through Nx.
2. Nx lint, typecheck, and build for `shared-models`, `api`, and
   `link-sharing`, using only targets available in each resolved project.
3. `git diff --check` and a scoped diff review that preserves unrelated
   worktree changes.
4. Manual visual comparison against both Figma nodes at desktop width.
5. Manual mouse and keyboard checks for open, close, select, Escape, focus,
   disabled behavior, selected styling, and scrolling through all 14 options.
