# Auth Callback and Home Guard Design

## Goal

Accept the Supabase signup callback on `/login`, persist a still-valid access token, redirect authenticated users to `/home`, and prevent unauthenticated access to `/home`.

## Scope

- Read Supabase callback parameters from the `/login` URL fragment.
- Store only `access_token` under the existing `ACCESS_TOKEN` local-storage key.
- Validate token expiry before storage and whenever a protected route is entered.
- Redirect a successful signup callback or form login to `/home`.
- Protect `/home` with an application-wide functional route guard.
- Do not create `/profile`; the route and page do not exist yet.
- Do not add refresh-token rotation, logout, or backend changes.

## Architecture

`AuthService` owns access-token persistence and expiry checks. It decodes only the JWT payload client-side to read the numeric `exp` claim; this is a freshness check, not signature verification. The API remains responsible for authenticating signed tokens when they are used.

`LoginComponent` owns callback-page coordination. On construction it reads the current route fragment, requires an `access_token`, checks both the JWT `exp` and the optional Supabase `expires_at`, saves a valid token through `AuthService`, and navigates to `/home` with history replacement. Invalid or expired callback fragments remain on `/login` and show an accessible error.

`authGuard` is an application-wide functional guard in `core/guards`. It delegates validity checking to `AuthService`; valid tokens allow navigation, while missing, malformed, or expired tokens are removed and navigation returns a `/login` URL tree.

## Data Flow

### Signup callback

1. Supabase redirects to `/login#access_token=...&expires_at=...`.
2. `LoginComponent` parses the fragment without sending it to the API.
3. `AuthService` checks the access token's JWT `exp`; `LoginComponent` also checks `expires_at` when present.
4. A valid token is saved and Angular replaces the current history entry with `/home`, removing the sensitive fragment from the visible URL.
5. An invalid or expired callback is not saved and an error is shown on `/login`.

### Protected navigation

1. Navigation to `/home` invokes `authGuard`.
2. The guard permits a still-valid stored token.
3. Otherwise `AuthService` removes the stale value and the router redirects to `/login`.

### Password login

1. The existing API returns `LoginResponse`.
2. `AuthService.save()` validates and stores its access token.
3. The login page navigates to `/home` with history replacement.

## Error Handling and Security

- Missing callback `access_token`, malformed JWT payloads, missing/non-numeric `exp`, and elapsed expiry timestamps are rejected.
- Client-side JWT decoding does not establish authenticity; authenticated API endpoints must continue verifying the signature server-side.
- `refresh_token` and other fragment values are intentionally not persisted.
- Callback navigation uses `replaceUrl` so browser history does not retain the token-bearing callback entry.

## Verification

Repository rules prohibit adding tests to either application. Verify with the `link-sharing` Nx lint, typecheck, and production build targets, plus a focused diff review. No API verification is required because the implementation does not change API files.
