# Register Page Design

## Goal

Implement the Angular registration page from Figma node `22139:5043`, connect it to the existing NestJS `POST /api/auth/register` endpoint, and extract the shared authentication shell into a reusable template used by both login and register pages.

## Scope

- Add a lazy-loaded `/register` route.
- Make the existing login “Create account” action navigate to `/register`.
- Add a register form with email, password, and confirm-password fields.
- Connect valid submissions to the existing registration endpoint.
- Keep the user on `/register` after success, hide the complete registration form, and show only an instruction to check their email for account confirmation beneath the shared page header.
- Make the register “Login” action navigate to `/login`.
- Extract the shared authentication page shell from `LoginComponent` into `AuthTemplateComponent`.
- Preserve current login behavior and the existing uncommitted login/auth changes.

## Architecture

### Authentication Template

Create `AuthTemplateComponent` at `apps/link-sharing/src/app/templates/auth-template/auth-template.component.ts`.

The template owns only shared authentication layout and presentation:

- Full-page grey background.
- Centered Devlinks logo.
- Responsive 476px authentication card.
- Shared title and description header.
- Mobile layout that removes the white card treatment.
- A content-projection slot for route-specific form content.

The template accepts required `title` and `description` signal inputs. It does not own form state, validation, API calls, routing behavior, or route-specific messages.

`LoginComponent` adopts this template and removes duplicated shell markup and styles. Login-specific form layout, validation, messages, submission, and session persistence remain in the login page.

### Register Page

Create `RegisterComponent` at `apps/link-sharing/src/app/pages/register/register.component.ts` as a lazy route-level standalone component.

The page owns:

- Angular Signal Form state for `email`, `password`, and `confirmPassword`.
- Field validation and presentation-ready error messages.
- Registration submission through `AuthApiService`.
- Pending, success, and API-error state, including replacing the form with the success message.
- Navigation back to `/login` through `RouterLink`.

The page reuses `AuthTemplateComponent`, `InputComponent`, and `ButtonComponent`. It does not introduce a combined login/register component because the two pages have different validation and submit flows.

### API Integration

Extend `AuthApiService` with:

```ts
public register(
  credentials: AuthCredentials,
): Observable<RegisterResponse>
```

Only `email` and `password` are sent. `confirmPassword` remains frontend-only and must never be included in the API request.

Add `RegisterResponse` to the public `@link-sharing/shared-models` API so Angular and NestJS share the registration response contract. Update `RegisterResponseDto` to use that shared model while keeping Supabase and NestJS-specific behavior in the API.

The existing `POST /api/auth/register` controller and service flow remains unchanged unless the shared return type requires a type-only adjustment.

## Form Validation

- Email is required and must be a valid email address.
- Password is required and must contain at least eight characters.
- Confirm password is required and must equal the password.
- Validation appears after a field is touched or after the user attempts submission.
- Invalid submission does not call the API.
- Pending submission disables the submit button to prevent duplicate requests.

The register page sends the trimmed, lowercased email behavior already enforced by the API DTO. Frontend validation improves feedback but does not replace server validation.

## Data Flow

1. User opens `/register` and enters all three fields.
2. Signal Forms derive field validity and display field-level errors.
3. Valid submission maps the page model to `{ email, password }`.
4. `AuthApiService.register()` posts credentials to `/api/auth/register`.
5. A successful response clears stale API errors and switches the page into its confirmation state.
6. The confirmation state removes the entire form, including all fields, the submit button, and the login footer, then displays only: “Check your email to confirm your account.” beneath the shared title and description.
7. The user remains on `/register`; no session is persisted and no automatic login occurs.
8. Before successful registration, the “Login” link navigates to `/login`.

## Error Handling

- Invalid email, short password, and password mismatch use field-level messages.
- HTTP 400 displays “Unable to create account.”
- Network errors and other HTTP statuses display “Unable to register. Please try again.”
- Form-level messages use accessible live-region semantics.
- Each new submission clears stale success and API error messages.
- After success, the form is no longer rendered, preventing another submission from the same page state.

## Visual Design

- Match Figma node `22139:5043` using existing typography, color, spacing, input, button, and logo assets.
- Render the title “Create account” and description “Let’s get you started sharing your links!”
- Render email, create-password, and confirm-password fields with existing email/password icons.
- Render the primary action as “Create new account”.
- Render the footer copy “Already have an account? Login”.
- Replace all projected form content with the confirmation message after successful registration while retaining the shared logo, title, and description.
- Reuse the authentication template at desktop and mobile breakpoints so login and register stay visually aligned.
- Keep component-specific SCSS inline and use BEM naming.

Direct Figma inspection was unavailable because no authenticated browser session or Figma connector was present. Copy and field structure follow the linked Frontend Mentor design and the supplied node identifier; final visual verification should compare the running page with Figma when access is available.

## Accessibility

- Use semantic `main`, `section`, `header`, and `form` structure across template and page.
- Associate visible labels with stable input IDs.
- Use password input types for both password fields.
- Preserve keyboard navigation and visible focus behavior from the shared atoms.
- Use `role="alert"` for errors and `role="status"` for success feedback.
- Use real router links rather than click handlers on non-interactive text.

## Testing and Verification

Repository rules prohibit adding tests to `apps/link-sharing` and `apps/api`; no test files will be created.

Verify through Nx:

- `npm exec -- nx run-many -t lint,typecheck,build -p link-sharing,api`
- Manual registration with mismatched passwords to confirm client validation.
- Manual successful registration to confirm the request payload excludes `confirmPassword` and the email-confirmation message appears.
- Confirm the successful state removes every form control, the submit action, and the login footer.
- Manual API-failure checks for HTTP 400 and generic error states.
- Manual navigation between `/login` and `/register`.
- Manual desktop and mobile comparison against Figma when an authenticated design view is available.

## Out of Scope

- Automatic login after registration.
- Redirecting away from `/register` after success.
- Resending confirmation email.
- Password-strength requirements beyond the existing eight-character minimum.
- Route guards, logout, refresh-token rotation, or authenticated application screens.
- Refactoring login/register into a single mode-driven page component.
- Backend authentication behavior changes beyond sharing the response contract.
