# Image Upload Atom Design

## Goal

Add a reusable `ImageUploadComponent` atom matching Figma node `22152:76`.
The atom lets a user choose an avatar image, immediately previews the selected
file, and emits that `File` to its parent. Upload submission and API integration
remain outside the component.

## Component Boundary

- Location:
  `apps/link-sharing/src/app/atoms/image-upload/image-upload.component.ts`
- Selector: `app-image-upload`
- Standalone Angular component using `ChangeDetectionStrategy.OnPush`
- The atom owns the native file-picker interaction, local preview lifecycle,
  accessible labeling, and the two visual states defined in Figma.
- The atom does not render a submit button, call an API, upload a file, persist
  an avatar URL, or own page-level form state.

## Public API

The component exposes two signals:

```ts
public readonly imageUrl = input<string | null>(null);
public readonly imageSelected = output<File>();
```

- `imageUrl` supplies an existing image URL. A non-null value initially renders
  the uploaded state; `null` renders the empty state.
- `imageSelected` emits the exact `File` selected by the user.
- Selecting a local file takes visual precedence over `imageUrl` so the user
  sees an immediate preview before submitting.
- The parent stores the emitted file and owns the separate submit action.

Example usage:

```html
<app-image-upload
  [imageUrl]="savedAvatarUrl()"
  (imageSelected)="selectedFile.set($event)"
/>

<app-button type="submit">Save</app-button>
```

## State And File Lifecycle

- A private signal stores the local object URL created for the most recently
  selected file.
- A computed preview URL returns the local object URL when present and otherwise
  returns `imageUrl`.
- On a valid file selection, the component revokes the previous local object
  URL, creates a new one, updates the preview, and emits the file once.
- If the picker closes without a file, the current preview and emitted state do
  not change.
- The component revokes its active local object URL when destroyed to avoid
  retaining browser memory.
- The component does not attempt to write a value back into the native file
  input or synchronize the selected file through Angular Signal Forms.

## Accepted Files

- The file input uses
  `accept="image/jpeg,image/png,image/webp"`, matching the existing avatar API's
  supported MIME types.
- The browser filter guides selection but is not treated as security or backend
  validation.
- File-size validation and error presentation are outside this atom because the
  supplied Figma node defines neither an error state nor validation copy.
- The API remains responsible for authoritative MIME-type and 5 MB size
  validation when a parent later submits the emitted file.

## Presentation

The empty state follows Figma node `22152:76`:

- 193px square interactive area with a 12px radius
- light-purple background (`#EFEBFF`)
- centered 40px image icon
- 8px vertical gap between icon and label
- `+ Upload Image` label in purple, Instrument Sans 16px semibold at 150%

The preview state follows the same node's uploaded variant:

- selected or existing image covers the 193px square with a 12px radius
- image uses `object-fit: cover`
- a 50% black overlay covers the image
- centered 40px white image icon
- `Change Image` label in white, Instrument Sans 16px semibold at 150%

The implementation converts the Figma-generated React/Tailwind reference into
an Angular inline template. Keep the reusable input-atom styles in
`apps/link-sharing/src/assets/scss/_input.scss`, as required by the repository's
SCSS conventions. Add `#EFEBFF` as the `purple-100` color token because that
Figma color is not currently in the repository; reuse the existing tokens for
all other represented colors. Do not add Tailwind.

## Interaction And Accessibility

- The visual tile is backed by a native file input and an associated label, so
  pointer activation and keyboard activation open the operating-system picker.
- The input has an explicit accessible name describing the current action:
  upload an image in the empty state and change the image in the preview state.
- Decorative icons and the preview image are hidden from assistive technology;
  the action label names the control.
- The tile has a visible keyboard focus state using the existing purple token.
- Choosing another image replaces the preview and emits the newly selected
  `File`.

## Asset Strategy

- Do not use Figma's localhost asset URLs at runtime.
- Add the image glyph as a local static SVG under
  `apps/link-sharing/public/images/icon-image.svg`; no equivalent repository
  asset currently exists.
- Use CSS masking or a current-color-compatible SVG presentation so the same
  glyph can render purple in the empty state and white in the preview state.

## API Integration Boundary

The existing API already exposes authenticated `GET` and `POST`
`/users/me/avatar` endpoints. This atom intentionally does not consume them.
A later page-level implementation may load the existing URL, pass it through
`imageUrl`, retain the emitted `File`, and upload that file only when its
separate submit button is activated.

## Scope And Verification

Repository rules prohibit adding tests in `apps/link-sharing`, so this work
does not create unit, integration, or end-to-end test files.

Verification consists of:

1. Nx lint, typecheck, and build for `link-sharing`.
2. `git diff --check` and a scoped diff review that preserves unrelated
   worktree changes.
3. Manual visual comparison against Figma node `22152:76` for empty and preview
   states.
4. Manual pointer and keyboard checks for opening the file picker, cancelling
   without a selection, selecting a supported image, changing the image, and
   observing exactly one `File` emission per selection.
5. A manual memory-lifecycle check confirming prior object URLs are revoked
   when the selection changes and the active URL is revoked on destruction.
