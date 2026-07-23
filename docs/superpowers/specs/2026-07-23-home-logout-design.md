# Home Logout Design

## Goal

Add a Logout button immediately to the left of Preview in the home header. Logging out removes the locally stored access token and returns the user to `/login`.

## Architecture

`AuthService` remains the single owner of authentication persistence and exposes `logout(): void` to remove `StorageKey.ACCESS_TOKEN`. `HomeHeaderComponent` coordinates the click by calling the service and navigating to `/login` with `replaceUrl: true`.

The header groups Logout and Preview in one flex action container. Both use the existing secondary button atom and existing spacing tokens. At narrower tablet widths the header switches to its compact grid and tab labels become visually hidden below 720px while remaining accessible, preventing the larger action group from overlapping navigation. No backend sign-out call is added because the current frontend session consists only of the locally stored access token and the API exposes no logout endpoint.

## Behavior

1. The authenticated user opens `/home`.
2. Logout appears directly left of Preview.
3. Clicking Logout removes `ACCESS_TOKEN`.
4. Angular replaces the current history entry with `/login`.
5. The existing guard prevents navigation back to `/home` without another valid token.

## Scope

- Modify only frontend auth persistence and the home header.
- Keep Preview behavior unchanged.
- Do not add backend session revocation, confirmation dialogs, `/profile`, or tests.

## Verification

Repository rules prohibit adding application tests. Verify through the `link-sharing` Nx lint, typecheck, and production build targets, followed by a focused diff review.
