# Login Page Design

## Goal

Implement Angular login page from Figma node `22139:5148` and connect it to the existing NestJS `POST /api/auth/login` endpoint.

## Scope

- Add a lazy-loaded `/login` route and redirect the empty route to it.
- Match the supplied desktop design and adapt it for small screens.
- Validate email and password with Angular Signal Forms.
- Submit credentials to the existing API.
- Store the successful login response in `localStorage` and show an inline success message without leaving the page.
- Show field validation and API errors.
- Keep the “Create account” text visually consistent with the design but inactive.
- Share auth request and response models between frontend and backend through an Nx library and a TypeScript path alias.

## Shared Contract

Create a focused Nx library for models consumed by both applications. Expose its public API through the alias `@link-sharing/shared-models`; neither application may import library implementation files directly.

The library exports:

- `AuthCredentials`: normalized email and password request shape.
- `LoginResponse`: authenticated user and Supabase session token metadata returned by the API.

The NestJS validation DTO implements `AuthCredentials` so decorators remain API-owned. The API login method returns `LoginResponse`. Angular imports both contracts only through the alias.

## Frontend Architecture

- `LoginComponent`: lazy page component responsible for layout, inline SCSS, Signal Form state, submit interaction, and presentation-ready messages.
- `BaseApiService`: receives `HttpClient` and the same-origin backend base URL `/api` through its constructor and builds endpoint URLs.
- `AuthApiService`: extends `BaseApiService` and owns the login HTTP mutation.
- `AuthSessionService`: owns the `localStorage` session key and persists successful login responses.
- Existing `InputComponent`: gains explicit email/password icon variants needed by the design.
- Existing `ButtonComponent`: gains native submit type support and remains responsible only for button presentation.

The page uses the existing Atomic Design folders. Shared atoms remain in `atoms`; route-specific composition belongs in `pages/login`. API calls live in `api`, while session persistence stays separate from the page. `/api` assumes the frontend and backend share an origin in production through a reverse proxy and uses the existing Angular proxy during local development.

## Data Flow

1. User enters email and password.
2. Signal Forms expose client validation state.
3. Invalid submission marks relevant controls and does not call the API.
4. Valid submission calls `AuthApiService.login()`, which posts `AuthCredentials` to `/api/auth/login`.
5. While pending, submit is disabled to prevent duplicate requests.
6. Success stores the full `LoginResponse` in `localStorage`, clears prior errors, and displays an accessible inline success message.
7. The route stays on `/login`.

## Error Handling

- Invalid email: field-level email message.
- Password shorter than eight characters: field-level password message.
- HTTP 401: form-level “Invalid email or password” message.
- Other HTTP/network failures: form-level generic retry message.
- Form-level messages use an accessible live region.
- A new submission clears stale success and API error messages.

## Visual Design

- Grey `#fafafa` full-page background.
- Centered Devlinks logo above a 476px white card.
- Card padding 40px, 12px radius, and 40px content gap.
- Form field and action spacing follows the Figma spacing tokens.
- Instrument Sans typography and existing color/spacing tokens are reused.
- Page and input component SCSS stays inline and is scoped with `:host`.
- Small screens remove the card treatment and use compact page padding while preserving hierarchy and touch target sizes.

## Testing and Verification

Repository rules prohibit adding tests to either application, so no test files are added. Verify through Nx targets:

- lint for `link-sharing` and `api`
- typecheck for `link-sharing` and `api`
- production builds for `link-sharing` and `api`
- manual login-page inspection against the supplied Figma screenshot when local services and environment variables are available

## Out of Scope

- Registration behavior or a `/register` route.
- Redirecting after login.
- Route guards, refresh-token rotation, logout, or authenticated app screens.
- API authentication behavior changes beyond consuming the shared contracts.
