# Link CRUD Design

## Scope

Add a NestJS REST feature for authenticated users to create, read, update,
and delete their links. Links are publicly readable by Supabase user ID.
Supabase Auth remains the source of account identity, while Prisma owns link
data in Supabase PostgreSQL.

The initial fixed platforms are GitHub, Frontend Mentor, Twitter, LinkedIn,
YouTube, Facebook, Twitch, Dev.to, Codewars, freeCodeCamp, GitLab, Hashnode,
and Stack Overflow.

## Data Model

Add a Prisma `Platform` enum and `Link` model. Each link has a UUID primary
key, the Supabase Auth user UUID, a platform, a normalized URL, and creation
and update timestamps.

The composite unique constraint `(userId, url)` prevents one user from
storing the same normalized URL more than once. Multiple links for the same
platform are allowed. There is no local `Profile` table because the current
feature has no profile-owned data beyond links.

Prisma does not create a relation to Supabase's `auth.users` schema. Account
deletion must delete the user's links explicitly through the API lifecycle.
Adding or changing the account-deletion endpoint itself is outside this Link
CRUD scope.

## API

Authenticated routes use the existing JWT guard and derive `userId` from
`request.user.claims.sub`:

- `POST /api/users/me/links` creates a link.
- `GET /api/users/me/links` lists the current user's links.
- `GET /api/users/me/links/:id` returns one owned link.
- `PUT /api/users/me/links/:id` replaces its platform and URL.
- `DELETE /api/users/me/links/:id` deletes it and returns HTTP 204.

`GET /api/users/:userId/links` is public and lists links for the supplied
Supabase user UUID.

List results use deterministic ordering by platform and then creation time.

## Application Boundaries

The feature follows `Controller -> Service -> Repository -> Database`:

- `LinkController` owns HTTP routing, DTO input, response status, and JWT
  principal extraction.
- `LinkService` owns URL normalization, platform-domain rules, ownership
  behavior, and translation of persistence outcomes into Nest exceptions.
- `LinkRepository` is the only link feature provider that calls
  `PrismaService`.
- DTOs define create/update inputs and serialized link responses.

All owned reads, updates, and deletes scope persistence operations by both
link ID and user ID. A link belonging to another user is therefore exposed as
not found rather than forbidden.

## URL Rules

Create and update accept HTTPS URLs only. The API parses and normalizes the
URL before persistence, then verifies that its hostname is the platform's
exact base domain or a subdomain of it. Substring matching is not allowed, so
hosts such as `github.com.example.com` are rejected.

The platform allowlist is held in one link-feature constant. It includes the
canonical domains and relevant aliases, such as `x.com` for Twitter and
`youtu.be` for YouTube. URL paths, queries, and fragments remain allowed.

Frontend validation is only a user-experience aid; the API always enforces
these rules.

## Errors

- Invalid URL protocol or platform-domain mismatch returns HTTP 400.
- A missing link or a link not owned by the current user returns HTTP 404.
- A duplicate normalized URL for the same user returns HTTP 409.
- Valid deletion returns HTTP 204 with no response body.

## Verification

The repository rules prohibit adding tests to `apps/api`, so this feature
will not add test files. Verification consists of Prisma schema validation
and client generation followed by the API lint, typecheck, and build targets
through Nx.
