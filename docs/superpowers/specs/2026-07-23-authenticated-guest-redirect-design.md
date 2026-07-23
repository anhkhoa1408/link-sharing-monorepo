# Authenticated Guest Redirect Design

## Goal

Prevent authenticated users from remaining on guest-only authentication routes
and make the application root resolve to the appropriate authenticated flow.

## Routing Behavior

- `/login` and `/register` remain available to unauthenticated users.
- An authenticated user who opens `/login` or `/register` is redirected to
  `/home`.
- `/` redirects to `/home`.
- The existing `authGuard` on `/home` continues to redirect unauthenticated
  users to `/login`.

## Implementation

Add a functional `guestGuard` under `core/guards`. It reads authentication state
from `AuthService` and returns either `true` for an unauthenticated user or a
`UrlTree` for `/home` for an authenticated user.

Apply `guestGuard` to the `/login` and `/register` routes. Change the empty-path
redirect from `/login` to `/home`. No component-level redirect logic is needed.

## Scope

Only frontend route configuration and the new functional guard are changed.
Authentication storage, login submission, callback handling, and protected-route
behavior remain unchanged.

## Verification

The repository forbids adding tests under `apps/link-sharing`, so no test files
will be created. Verify the change through the existing Nx `lint`, `typecheck`,
and `build` targets for `link-sharing`.
