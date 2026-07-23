# Preview And Share Page Design

## Goal

Implement the Figma preview screen at node `22139:3837` as two routes backed
by real user data:

- `/preview` lets the signed-in user inspect and share their public page.
- `/share/:userId` is the public page sent to other people.

Both routes reuse one profile-page presentation component. The preview route
adds owner-only navigation and sharing controls around that presentation.

## Routes And Access

- Add a lazy-loaded `/preview` route protected by the existing `authGuard`.
- Add a lazy-loaded `/share/:userId` route without an auth guard.
- Keep `/home` as the editor destination for the Back to Editor action.
- Treat `userId` as a UUID in the public API. A malformed or unknown user ID
  produces the public not-found state instead of exposing provider details.

## API Aggregation

Expose one purpose-built response so the frontend does not coordinate separate
auth, profile, avatar, and link requests:

- `GET /users/me/profile-page` uses `JwtAuthGuard` and derives the user ID from
  the verified access token.
- `GET /users/:userId/profile-page` is public and validates `userId`.

Both endpoints return the same shared model:

```ts
export interface ProfilePage {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  links: readonly ProfilePageLink[];
}

export interface ProfilePageLink {
  id: string;
  platform: Platform;
  url: string;
}
```

The aggregation service reads:

- identity and email from Supabase Auth;
- first and last name from the Prisma-owned `Profile` table introduced by the
  profile editor;
- the avatar signed URL from the existing Supabase Storage avatar flow;
- ordered links from the existing Prisma link repository.

The public response intentionally exposes the Supabase account email, as
confirmed for this feature. It must never expose auth tokens, provider
metadata, storage paths, or privileged Supabase data.

`displayName` is the trimmed persisted first and last name. If no profile name
has been saved, it falls back to the part of the email before `@`. A missing
avatar is represented by `null`, not a failed response. Links retain the
repository's stable ordering. An unknown Supabase user returns `404`; provider,
database, or storage outages use the project's existing unavailable-error
handling.

Shared request/response types live in `libs/shared-models`. Prisma remains
accessible only through repositories. The aggregation layer composes focused
services or repositories and does not query Prisma or Supabase directly from a
controller.

## Frontend Composition

Add a route-level page component for each route and a reusable profile-page
template:

- `PreviewComponent` loads `GET /users/me/profile-page`, renders the owner
  header, and supplies the loaded profile to the shared template.
- `ShareComponent` reads `userId` from the route, loads
  `GET /users/:userId/profile-page`, and supplies the result to the same
  template.
- `ProfilePageTemplateComponent` owns the visual background, centered profile
  card, avatar, identity, and link list. It receives profile data as a required
  signal input and performs no routing or data fetching.

The template reuses `PreviewTagComponent` for each social link. It uses
`NgOptimizedImage` only where its constraints fit signed avatar URLs; otherwise
the avatar remains a normal image with explicit dimensions. A missing avatar
renders an accessible neutral placeholder without introducing a new remote
asset.

API access belongs in a root frontend API service using Angular
`httpResource`-compatible GET methods and the configured bearer-token
interceptor. Route pages coordinate loading, error, and resolved states with
signals.

## Preview-Only Interactions

The preview header matches the Figma screen:

- Back to Editor navigates to `/home`.
- Share Link copies the absolute `/share/:userId` URL for the loaded profile.

After a successful copy, show the Figma toast text, “The link has been copied
to your clipboard!”, as a polite live status. If the Clipboard API is
unavailable or rejects the write, show an accessible failure message and keep
the button usable. The public share route does not render the owner header or
copy toast.

## Loading, Empty, And Error States

- While data loads, preserve the page structure and show a centered loading
  status.
- A valid profile with no links still shows identity and an empty-links
  message.
- `/share/:userId` renders a neutral public not-found state for malformed or
  unknown user IDs.
- `/preview` authentication failures continue through the existing auth
  behavior; other failures render a retryable error without discarding the
  route.
- Individual missing avatars do not fail the whole page.

All status and toast messages use semantic live regions. Link anchors retain
their existing new-tab behavior, visible focus treatment, and accessible
labels.

## Responsive And Visual Design

Match Figma node `22139:3837`:

- grey-50 page background;
- a 357px purple-600 top field with 32px bottom corner radii on desktop;
- a white header inset by 24px, with a 12px radius;
- a centered white profile card, 349px wide, with 56px horizontal and 48px
  vertical padding, 24px radius, and the existing 32px soft shadow;
- a 104px circular avatar with a purple border;
- 32px bold name, 16px grey-500 email, and 24px gaps between 56px link tags;
- the dark success toast centered near the bottom.

Use existing colour, typography, spacing, and platform presentation tokens.
Keep component styles inline, scoped, and BEM-named. Do not introduce Tailwind
or use Figma localhost asset URLs.

At tablet and mobile widths, keep the header controls reachable, reduce outer
spacing, remove unnecessary fixed dimensions, and allow the profile surface to
use the viewport width without horizontal overflow. The public page remains
visually consistent but omits the owner header. Non-essential motion respects
`prefers-reduced-motion`.

## Scope Boundaries

Included:

- authenticated preview and public share routes;
- shared page presentation;
- aggregate API endpoints and shared response model;
- public email, profile name, signed avatar, and saved link data;
- clipboard feedback and responsive/error states.

Excluded:

- profile or link editing on either new route;
- analytics, share counters, social share integrations, or custom slugs;
- changes to Supabase email or avatar upload behavior;
- new test files under either application, because repository rules prohibit
  them.

The implementation may build on the separately designed profile persistence
work. It must preserve unrelated uncommitted changes already present in the
worktree.

## Verification

Run relevant checks through Nx:

1. `npm exec -- nx run api:prisma:validate`
2. `npm exec -- nx run api:prisma:generate`
3. `npm exec -- nx run-many -t lint,typecheck,build -p link-sharing,api`
4. `git diff --check`
5. Render `/preview` and `/share/:userId` at desktop and mobile widths.
6. Compare `/preview` with Figma node `22139:3837`.
7. Verify authenticated loading, public loading, not-found behavior, empty
   avatar and links, external link navigation, Back to Editor, successful and
   failed clipboard feedback, keyboard focus, live status announcements, and
   horizontal overflow.
