# Preview Tag Molecule Design

## Goal

Add a reusable `PreviewTagComponent` molecule matching Figma node
`22152:190`. The component presents a saved link with its platform branding and
opens the supplied URL in a new browser tab.

## Component Boundary

- Location:
  `apps/link-sharing/src/app/molecules/preview-tag/preview-tag.component.ts`
- Selector: `app-preview-tag`
- Standalone Angular component using `ChangeDetectionStrategy.OnPush`
- Inline Angular template and inline SCSS
- The molecule owns link semantics, platform branding, icon rendering, and
  visual interaction states.
- The parent owns layout, ordering, and the platform and URL values supplied to
  each tag.
- The component does not fetch link data, validate URLs, or render a list of
  tags.

## Shared Platform Presentation

Create
`apps/link-sharing/src/app/core/constants/platform-presentation.constant.ts`
as the application-wide source of platform display metadata.

The module exports:

```ts
export interface PlatformIconDefinition {
  readonly path: string;
  readonly viewBox: string;
}

export interface PlatformPresentation {
  readonly icon: PlatformIconDefinition;
  readonly label: string;
}

export const PLATFORM_PRESENTATION: Readonly<
  Record<Platform, PlatformPresentation>
>;
```

Move the existing labels and SVG definitions out of `PlatformSelectComponent`
into this constant, then import the constant back into the select and into
`PreviewTagComponent`. This removes duplicated platform metadata while keeping
the reusable molecule independent of an organism implementation.

`PLATFORM_PRESENTATION` covers every value in the shared `Platform` union. The
Figma node displays 13 platform treatments while the current domain contains
14 platforms; `CODEPEN` remains supported with its existing icon and a dark
brand treatment so the component API stays exhaustive.

## Public API And Link Semantics

The component exposes two required signal inputs:

```ts
public readonly platform = input.required<Platform>();
public readonly url = input.required<string>();
```

It renders a native anchor using the URL as `href` and always sets:

```html
target="_blank"
rel="noopener noreferrer"
```

The platform label is visible link text. Both icons are decorative and use
`aria-hidden="true"`, so no redundant accessible names are announced. URL
validation remains the responsibility of the existing form and API layers.

Example usage:

```html
<app-preview-tag platform="GITHUB" [url]="link.url" />
```

## Presentation

The tag fills the width provided by its parent rather than fixing the 237px
example width from Figma. Its content matches the design:

- 16px padding on every side
- 8px gap between the platform icon, label, and arrow
- 8px border radius
- 56px natural height
- 16px platform icon, except the designs whose source icon requires 20px
- 16px arrow icon
- Instrument Sans, 16px, regular weight, 150% line height
- Label grows to consume the available horizontal space

Brand treatments match the Figma variants:

- GitHub: grey-950 background, white foreground
- Frontend Mentor: white background, grey-200 border, grey-900 text, branded
  multicolour icon, and grey-500 arrow
- Twitter: `#43b7e9` background, white foreground
- LinkedIn: blue-500 background, white foreground
- YouTube: red-550 background, white foreground
- Facebook: `#2442ac` background, white foreground
- Twitch: `#ee3fc8` background, white foreground
- Dev.to: grey-900 background, white foreground
- Codewars: pink-900 background, white foreground
- freeCodeCamp: purple-950 background, white foreground
- GitLab: orange-500 background, white foreground
- Hashnode: blue-800 background, white foreground
- Stack Overflow: orange-600 background, white foreground
- CodePen: grey-950 background, white foreground

Reusable missing brand values are added to the global colour token map rather
than repeated as raw component literals. Component styles use a `preview-tag`
BEM block and platform modifier classes. The implementation does not use
Tailwind, Angular Material, inline style attributes, or Figma localhost asset
URLs.

## Interaction And Accessibility

- Native anchor semantics provide keyboard navigation and activation.
- Hover may slightly reduce brightness without changing the platform identity.
- `:focus-visible` provides a visible purple focus ring.
- A reduced-motion media query disables any non-essential transition.
- Long labels are protected from breaking the layout with a shrinking label
  region and text overflow handling.
- No click output is added because navigation is the component's complete
  interaction responsibility.

## Scope And Verification

This work creates the molecule, extracts shared platform presentation metadata,
and updates `PlatformSelectComponent` to consume that metadata. It does not add
the molecule to a page, organism, route, or preview list.

Repository rules prohibit tests in `apps/link-sharing`, so implementation does
not create unit, integration, or end-to-end test files.

Verification consists of:

1. `npm exec -- nx lint link-sharing`
2. `npm exec -- nx typecheck link-sharing`
3. `npm exec -- nx build link-sharing`
4. `git diff --check` and a scoped diff review preserving unrelated worktree
   changes
5. Manual comparison with Figma node `22152:190`
6. Manual keyboard and pointer checks confirming new-tab navigation and the
   expected focus treatment
