# Input Atom Design

## Goal

Add a reusable native input atom matching Figma node `22152:46`. Bind the input to Angular Signal Forms and render validation feedback below the field with an 8px gap.

## Component

- Location: `apps/link-sharing/src/app/atoms/input/input.component.ts`
- Selector: `app-input`
- Standalone Angular component using `ChangeDetectionStrategy.OnPush`
- Native `<input>` bound with the Signal Forms `[field]` directive
- Inline template; component-specific styles remain colocated unless an existing global style convention requires a focused input partial
- Inline decorative link SVG; hidden from assistive technology

## Public API

- `formField`: required generic `FieldTree<T>` used by `[field]`, where `T` supports text values or numeric values including the native empty-number value `null`
- `placeholder`: optional string, default empty
- `type`: supported native input type (`text`, `email`, `password`, `number`, `url`, `tel`, or `search`), default `text`
- `min`: optional string or number passed to the native minimum attribute for compatible input types
- `max`: optional string or number passed to the native maximum attribute for compatible input types
- `ariaLabel`: required accessible name
- `isError`: boolean visual error state, default `false`
- `errorMessage`: optional string shown only while `isError` is true

## Visual States

- Default/filled: white background, grey border, dark-grey text, muted placeholder
- Focus: purple border and `0 0 32px rgb(99 60 255 / 25%)` glow
- Error: red border and input text
- Input shell: 8px radius, 16px padding, 16px icon/content gap, 16px icon
- Error text: 12px regular Instrument Sans, red, below input
- Field/error vertical gap: 8px (`--spacing-100`)
- Width follows containing block rather than hard-coding Figma's 480px example width
- Number inputs hide browser spinner controls in WebKit and Firefox without changing keyboard entry or native `min`/`max` validation

## Accessibility

- `ariaLabel` supplies the input accessible name
- `aria-invalid` reflects `isError`
- Error message receives a stable generated ID and is connected through `aria-describedby`
- Decorative SVG uses `aria-hidden="true"`
- Native keyboard and focus behavior remain intact

## Scope And Verification

- Do not add a test spec because repository rules prohibit new `*.spec.ts` files in the app
- Do not modify unrelated user changes
- Verify with the resolved Nx targets for `link-sharing`: lint, typecheck, and build
