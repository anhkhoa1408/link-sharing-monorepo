# Tab Button Molecule Design

## Goal

Add a reusable `TabButtonComponent` molecule matching Figma node `22152:87`.
The component renders a labelled navigation-style button with a known icon,
exposes controlled active state, and reports pointer or keyboard activation to
its parent.

## Component Boundary

- Location:
  `apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts`
- Selector: `app-tab-button`
- Standalone Angular component using `ChangeDetectionStrategy.OnPush`
- Inline Angular template and inline SCSS
- The molecule owns icon lookup, visual states, button semantics, and activation
  output.
- The parent owns which button is active and what content changes after
  activation.
- The molecule does not integrate with Angular Router, retain selected state,
  render a tab list, or modify the existing `ButtonComponent` atom.

## Public API

The component exposes three signal inputs and one output:

```ts
export type TabButtonIcon = 'link' | 'profile';

public readonly label = input.required<string>();
public readonly icon = input.required<TabButtonIcon>();
public readonly active = input(false);
public readonly pressed = output<void>();
```

- `label` supplies the visible and accessible button label.
- `icon` selects a known icon from the component's private SVG definition map.
- `active` controls the selected presentation and `aria-pressed` value.
- `pressed` emits once when the native button is activated by pointer or
  keyboard.
- The component does not update `active`; the parent handles `pressed` and
  supplies the next active value.

Example usage:

```html
<app-tab-button
  icon="link"
  label="Links"
  [active]="activeSection() === 'links'"
  (pressed)="activeSection.set('links')"
/>
```

## Icon Strategy

- Keep a private, typed SVG definition map in the component file. Each entry
  provides the exact `viewBox` and path data required by the template.
- Include `link-bold` for the `link` value and `user-circle-bold` for the
  `profile` value.
- Render the selected path with `fill="currentColor"` so icon color follows the
  button state.
- Mark the SVG as decorative with `aria-hidden="true"`; the visible label names
  the control.
- Do not add an icon package, create runtime requests to Figma localhost assets,
  or accept arbitrary path data from consumers.
- Add future icons only by extending both `TabButtonIcon` and the exhaustive SVG
  definition map.

## Presentation

Match the three Figma states using existing CSS custom properties:

- 16px vertical and 24px horizontal padding
- 8px gap between icon and label
- 8px border radius
- 20px square icon
- Instrument Sans, 16px, semibold, 150% line height, and no letter spacing
- Default: transparent background with grey-500 icon and label
- Hover: transparent background with purple-600 icon and label
- Active: purple-100 background with purple-600 icon and label

The button sizes to its content instead of using a fixed width. Inline molecule
SCSS uses a `tab-button` BEM block and the existing color, spacing, typography,
and weight tokens. It does not use Tailwind, Angular Material, or inline style
attributes.

## Interaction And Accessibility

- Render a native `<button type="button">` so Enter and Space activation work
  without custom keyboard handlers.
- Bind `aria-pressed` to `active`, representing a button that selects a section
  without claiming the full WAI-ARIA tab pattern.
- Emit `pressed` from the native click event. Keyboard activation produces the
  same click path and therefore one output event.
- Provide a visible purple focus indicator through `:focus-visible`.
- Do not add disabled, loading, or error APIs because the supplied Figma node
  defines none.
- Do not add `role="tab"`; a compliant tab widget would also require a parent
  `tablist`, roving focus, and arrow-key coordination outside this component's
  requested scope.

## Scope And Verification

This work creates only the molecule. It does not place the component in a
header, page, organism, or route.

Repository rules prohibit tests in `apps/link-sharing`, so implementation does
not create unit, integration, or end-to-end test files.

Verification consists of:

1. `npm exec -- nx lint link-sharing`
2. `npm exec -- nx typecheck link-sharing`
3. `npm exec -- nx build link-sharing`
4. `git diff --check` and a scoped diff review that preserves unrelated
   worktree changes
5. Manual comparison with Figma node `22152:87` for default, hover, active, and
   keyboard focus states
6. Manual pointer and keyboard checks confirming one `pressed` emission per
   activation and parent-controlled active-state updates
