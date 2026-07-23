# Home Empty State Design

## Goal

Add the Figma empty state from node `22147:962` to `/home` and make the first
link-building interaction functional. The page starts with no editor cards;
Add new link creates a card, while the phone preview renders a branded link
only after that card contains a selected platform and a valid matching URL.

## State Ownership

`HomeComponent` owns a page-scoped signal containing the ordered link drafts.
Each draft has a stable generated ID, a nullable `Platform`, and a URL string.
The page derives valid preview links with `computed`; preview components receive
data and do not mutate it.

Do not introduce an application-wide service or shared Nx library. The state is
not persisted and resets when the page reloads.

## Empty State

When the draft list is empty:

- Keep the existing page header, heading, description, Add new link button, and
  phone frame.
- Replace editor cards with a grey-50, 12px-radius empty panel that fills the
  available editor area.
- Center the Figma illustration, the 32px bold heading “Let’s get you started”,
  and the supplied explanatory copy with the Figma spacing and width.
- Store the illustration as a checked-in public asset; do not reference the
  Figma localhost server at runtime.
- Render five grey link placeholders in the phone preview.
- Disable Save using the existing button API.

Create a page-private `EmptyLinksComponent` under
`pages/home/_components`. It owns only the illustration, copy, and empty-panel
presentation.

## Add And Remove Flow

Each Add new link activation appends one draft with a unique stable ID, null
platform, and empty URL. The editor renders one `LinkEditorCardComponent` per
draft in insertion order with stable `@for` tracking.

Update `LinkEditorCardComponent` so its Remove button emits its draft ID. The
page removes that draft. If the draft currently has a phone preview tag, the tag
disappears at the same time.

The phone preview keeps a total of five visual slots. Valid drafts render first
as branded `PreviewTagComponent` links in draft order; remaining slots render as
grey placeholders. A newly added incomplete or invalid draft does not render a
branded tag and therefore does not replace a placeholder.

## Validation

A draft is previewable only when all conditions are true:

1. A platform is selected.
2. The URL parses successfully and uses the `https:` protocol.
3. The hostname equals an allowed domain for that platform or is its subdomain.

Use the existing domain rules from the shared link model/API vocabulary where
available. If no shared frontend-safe map exists, add one page-scoped typed
constant covering every `Platform` value and relevant aliases. Hostname checks
must use exact equality or the `.<domain>` suffix; substring matches such as
`github.com.example.com` are invalid.

Draft editing remains available when invalid. No error message is added in this
scope because the interaction requirement is only to suppress invalid phone
preview tags.

## Component Interfaces

- `HomeComponent`: owns draft creation, removal, updates, and derived previews.
- `EmptyLinksComponent`: presentational empty-state panel with no inputs.
- `LinkEditorCardComponent`: receives one draft’s ID/index/form controls and
  emits removal.
- `PhonePreviewComponent`: receives an ordered readonly preview-link list and
  renders branded tags plus enough placeholders to reach five slots.

Existing atoms, molecules, design tokens, standalone APIs, OnPush change
detection, inline templates, inline SCSS, and BEM naming remain in use.

## Excluded Work

- API loading or persistence
- Save behavior and success/error feedback
- Drag-and-drop reordering
- Profile Details or Preview navigation behavior
- Authentication changes
- New tests, because repository rules prohibit tests in `apps/link-sharing`

## Verification

Run the frontend targets through Nx:

1. `npm exec -- nx lint link-sharing`
2. `npm exec -- nx typecheck link-sharing`
3. `npm exec -- nx build link-sharing`
4. `git diff --check`
5. Manually verify empty, added-invalid, added-valid, edited-invalid, multiple
   links, Remove, desktop, and narrow viewport states against Figma.
