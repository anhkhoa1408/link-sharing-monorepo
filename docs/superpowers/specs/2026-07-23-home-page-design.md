# Home Page Design

## Goal

Implement the authenticated `/home` page from Figma node `22149:76`. The
first delivery is presentation-only: it uses fixed example data and does not
load, add, remove, reorder, validate, or persist links.

## Route And Page Boundary

- Add a lazy-loaded `/home` route for `HomeComponent` at
  `apps/link-sharing/src/app/pages/home/home.component.ts`.
- Keep `/login` and `/register` unchanged. Authentication guards and automatic
  post-login navigation are outside this visual-only scope.
- `HomeComponent` owns the example data and composes focused reusable UI
  components. It does not call an API or own product-domain business logic.

## Composition

Follow the repository's Atomic Design structure and reuse the current atoms and
organisms where their APIs fit:

- Use `ButtonComponent` for Preview, Add new link, and Save actions.
- Use `InputComponent` for the URL controls.
- Use `PlatformSelectComponent` for the platform controls.
- Use or implement the already-designed `TabButtonComponent` molecule for the
  Links and Profile Details navigation items.
- Use or implement the already-designed `PreviewTagComponent` molecule for the
  GitHub, YouTube, and LinkedIn items in the phone preview.
- Add page-scoped presentational components only where they materially keep the
  route component focused, such as the app header, phone preview, or editable
  link card. Do not create a shared Nx library because there is no cross-project
  consumer.

All components use standalone Angular APIs, `ChangeDetectionStrategy.OnPush`,
inline templates, inline SCSS, BEM class names, and existing design tokens.

## Visual Design

Match Figma node `22149:76` at desktop size:

- Grey-50 page background with 24px outer spacing.
- White, 12px-radius header containing the Devlinks logo, centered navigation,
  and outlined Preview button.
- Two-column main area with a 560px white preview panel and a flexible white
  editor panel.
- Phone frame with profile placeholders and three branded preview tags.
- Editor heading, description, outlined Add new link button, two grey-50 link
  cards, and a bottom action bar with the primary Save button.
- Use Instrument Sans typography and the existing spacing, colour, font-size,
  font-weight, and line-height custom properties.
- Inline stable SVG paths or checked-in public assets replace Figma localhost
  asset URLs. Do not add Tailwind or another dependency.

At narrower widths, preserve the same visual hierarchy while preventing
horizontal overflow. Hide the phone preview when the two-column composition no
longer fits, allow the editor to fill the content width, and reduce header/page
spacing for small screens. Navigation remains keyboard accessible; labels may
be visually condensed only when required by available width.

## Static State And Semantics

- Render two editor examples: GitHub and YouTube.
- Render three preview examples: GitHub, YouTube, and LinkedIn.
- Buttons retain native button semantics, hover treatment, and visible
  `:focus-visible` states, but do not mutate data in this scope.
- URL fields and platform selects display the example values. They may accept
  local control interaction required by their native/component semantics, but
  no action is saved and the phone preview remains fixed.
- Link card Remove controls are buttons. Field labels are programmatically
  associated with their controls, and decorative SVGs are hidden from assistive
  technology.

## Excluded Work

- Link API integration, persistence, loading, success, or error states
- Add, remove, reorder, save, or live-preview behavior
- Profile Details and Preview routes or content
- Authentication guards and login redirect changes
- New tests, because repository rules prohibit tests in `apps/link-sharing`

## Verification

Run the frontend targets through Nx:

1. `npm exec -- nx lint link-sharing`
2. `npm exec -- nx typecheck link-sharing`
3. `npm exec -- nx build link-sharing`
4. `git diff --check`
5. Render `/home` at desktop and narrow viewport sizes, then compare the desktop
   result against Figma node `22149:76` and check keyboard focus and overflow.
