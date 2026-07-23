# Page Facade Services Design

## Goal

Move API calls, API error handling, and API-response processing out of all five
route components into page-scoped facade services while keeping forms and
validation in the components.

## Scope

The change covers these pages:

- `home`
- `login`
- `register`
- `profile`
- `profile-page`

Each facade lives in its page's private `_services` directory:

```text
pages/home/_services/home-facade.service.ts
pages/login/_services/login-facade.service.ts
pages/register/_services/register-facade.service.ts
pages/profile/_services/profile-facade.service.ts
pages/profile-page/_services/profile-page-facade.service.ts
```

The file and class names include both `Facade` and `Service`. For example,
`home-facade.service.ts` exports `HomeFacadeService`.

## Architecture

API services remain transport-only dependencies. A page facade injects the API
services needed by that page, coordinates requests, processes API responses and
errors, and exposes readonly signals or focused commands to its component.

Each facade uses `@Injectable()` without `providedIn: 'root'`. Its page component
adds the facade to `providers`, so its state is created and destroyed with that
page instance.

The normal data flow is:

```text
Template event
  -> component reads and validates its form
  -> component creates an API request DTO
  -> facade calls API services
  -> facade processes the response or error
  -> facade updates readonly API-derived state
  -> component and template render that state
```

Writable signals remain private to the facade. Components may expose facade
signals to their templates through readonly aliases.

## Responsibility Boundary

### Facades own

- API service injection and invocation
- Conversion from Observable API calls to the page's asynchronous workflow
- Loading, saving, submitting, success, and API-error state
- Mapping or combining API responses into page-ready data
- Server snapshots needed to coordinate API persistence
- Authentication session processing that is a direct consequence of a login
  response
- Route-driven API resource state for the profile page

### Components retain

- Signal Forms and their backing models
- Form validation, touched state, and submitted state
- DOM events and template interaction handlers
- UI-only state such as selected local files, object URLs, clipboard messages,
  and toast timers
- Presentation-only computed values
- Converting valid form values into request DTOs

No facade imports or depends on a component.

## Page Designs

### Home

`HomeFacadeService` injects `LinkApiService`. It owns the saved server snapshot,
loading/saving state, API message/error state, loading links, and coordinating
link deletion plus create/update requests.

The component keeps link draft Signal Forms, draft IDs, URL validation, link
preview computation, and change detection against the facade's saved snapshot.
It passes normalized link entries to the facade for persistence and rebuilds
drafts from the saved response.

### Login

`LoginFacadeService` injects `AuthApiService` and `AuthService`. It owns login
request state, maps unauthorized responses to the existing invalid-credentials
message, stores a valid returned session, and reports other API/session failures
through its error signal.

The component keeps the login form, validation, submitted state, URL-fragment
authentication callback handling, and navigation.

### Register

`RegisterFacadeService` injects `AuthApiService`. It owns registration request
state, the registered-success state, and API error mapping.

The component keeps the registration form, password confirmation validation,
submitted state, and submit event.

### Profile

`ProfileFacadeService` injects `AuthApiService`, `AvatarApiService`,
`ProfileApiService`, and `LinkApiService`. It loads the four data sources
concurrently, applies the existing optional avatar/profile fallbacks, and
exposes one page-ready data state together with loading/error/retry state.

It also coordinates profile updates and optional avatar upload, retaining the
current partial-success and retry behavior. The component keeps account/profile
forms, validation, selected-file state, local object URL lifecycle, and preview
computations.

### Profile Page

`ProfilePageFacadeService` injects `ProfilePageApiService`, `ActivatedRoute`,
`AuthService`, and `Router`. It derives owner/public API URLs from route state,
owns the `httpResource`, computes public-not-found state, reloads the resource,
and handles an unauthorized owner preview.

The component keeps clipboard access, share URL construction, clipboard toast
state/timer, display helpers, and explicit UI navigation actions.

## Error Handling

Existing user-facing messages and behavior remain unchanged. Facades catch API
failures at the request boundary and expose page-ready error state; components
do not inspect `HttpErrorResponse` for facade-managed calls.

A new request clears stale request messages where the current component already
does so. Loading and submitting signals are reset in `finally` paths so failed
requests cannot leave the page disabled.

## Constraints

- Do not change backend APIs or shared DTOs.
- Do not move Signal Forms or validation into facades.
- Do not create shared Nx libraries; every facade has one page consumer.
- Do not add tests or test files under either application, per repository rules.
- Preserve existing UI copy, behavior, and routes.
- Preserve unrelated changes already present in the working tree.

## Verification

Run frontend checks through Nx:

```bash
npm exec -- nx run link-sharing:typecheck
npm exec -- nx run link-sharing:lint
npm exec -- nx run link-sharing:build
```

Verify that page components no longer import or inject API services and that
each facade is provided only by its corresponding page component.
