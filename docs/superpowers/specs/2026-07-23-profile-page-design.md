# Profile Page Design

## Goal

Implement the authenticated `/profile` page from Figma node `22149:1655`.
The page loads and updates the signed-in user's profile, uploads an avatar
through the existing Supabase-backed API, and updates the phone preview as the
user edits the form.

## Routes And Shared Layout

- Keep `/home` as the links editor and add a lazy-loaded `/profile` route.
- Introduce `MainTemplateComponent` as the shared authenticated application
  shell for `/home` and `/profile`.
- The template owns the Devlinks header, route-aware Links and Profile Details
  navigation, Preview action, responsive two-column layout, and phone-preview
  region.
- Each route supplies only its page content and page-specific preview state.
- Navigation uses Angular router links. The active tab is derived from the
  current route rather than duplicated page state.

## Frontend Composition

- Reuse `ButtonComponent`, `InputComponent`, `ImageUploadComponent`,
  `TabButtonComponent`, `PreviewTagComponent`, and the existing phone-preview
  presentation where their APIs fit.
- Build the profile form with Angular Signal Forms.
- The editable fields are `firstName` and `lastName`; both are required.
- Load the signed-in account email from `GET /auth/me` and render it as a
  non-editable field. Changing a Supabase Auth email and its verification flow
  are outside scope.
- Load the saved profile and avatar when the page starts.
- Keep selected avatar files local until Save. A local object URL provides an
  immediate preview and must be revoked when replaced or when the page is
  destroyed.
- Update the phone preview immediately from the local form values and selected
  avatar. Existing link examples/data remain available in the preview.

## Profile Persistence

Add a Prisma `Profile` model:

- `id`: UUID primary key
- `userId`: unique Supabase user UUID
- `firstName`: required string
- `lastName`: required string
- `createdAt`: creation timestamp
- `updatedAt`: automatically updated timestamp

Prisma owns this product-domain table. Supabase Auth remains the source of the
account identity and email; Supabase Storage remains the source of avatar
files.

Add a focused NestJS profile module:

- `GET /users/me/profile` returns the current user's profile.
- `PUT /users/me/profile` validates and upserts the current user's first and
  last names.
- Both endpoints use `JwtAuthGuard` and derive `userId` from the authenticated
  token. The client never supplies a user ID.
- Only the repository accesses Prisma.

Shared request and response models live in `shared-models` because both
applications consume them.

## Avatar Flow

- Continue using `GET /users/me/avatar` and `POST /users/me/avatar`.
- Preserve the existing API contract: JPEG, PNG, or WebP up to 5 MB.
- Do not add pixel-dimension validation.
- The UI helper text reflects the actual API contract rather than the original
  Figma copy.
- Avatar signed URLs are display data only and are not persisted in the
  `Profile` table.

## Save And Error Handling

- Save first validates the Signal Form.
- Persist the text profile and, when a new file exists, upload the avatar as
  separate authenticated requests.
- Disable Save while requests are in flight to prevent duplicate submission.
- On complete success, replace local state with the server responses and show a
  success message.
- If profile persistence succeeds but avatar upload fails, retain the selected
  file and report that the avatar was not saved so the user can retry.
- Loading failures remain visible and retryable. An absent profile or avatar is
  treated as an empty initial state, while authentication and infrastructure
  errors are surfaced.
- Validation and request errors use accessible status messaging and do not
  remove the user's current input.

## Responsive And Visual Design

- Match Figma node `22149:1655` at desktop size: grey-50 page background,
  24px outer spacing, white 12px-radius shell panels, 560px preview column, and
  a flexible profile editor.
- Use Instrument Sans and existing colour, typography, spacing, and radius
  tokens. Do not add Tailwind.
- At narrower widths, hide the desktop phone panel when the two-column layout
  no longer fits and let the form fill the available width.
- On mobile, stack form labels and controls, reduce page spacing, keep actions
  reachable, and prevent horizontal overflow.
- Preserve semantic labels, keyboard navigation, visible focus states, and
  status announcements.

## Excluded Work

- Supabase email changes or email-verification workflows
- Avatar deletion
- Image pixel-dimension validation or client-side image processing
- Public profile-page implementation
- Changes to link CRUD behavior
- New tests under either application, because repository rules prohibit them

## Verification

Run all relevant checks through Nx:

1. `npm exec -- nx run api:prisma:validate`
2. `npm exec -- nx run api:prisma:generate`
3. `npm exec -- nx run-many -t lint,typecheck,build -p link-sharing,api`
4. `git diff --check`
5. Render `/home` and `/profile` at desktop and mobile widths.
6. Compare `/profile` with Figma node `22149:1655`.
7. Verify route navigation, initial loading, live preview, disabled email,
   successful profile save, optional avatar upload, partial avatar failure,
   keyboard focus, and overflow behavior.
