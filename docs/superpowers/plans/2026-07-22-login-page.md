# Login Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Figma-matched Angular login page, connect it to the existing NestJS login API, and share the auth contract through an aliased Nx library.

**Architecture:** A non-buildable `@nx/js` library exposes request/response interfaces through `@link-sharing/shared-models`. NestJS keeps validation decorators in its DTO while implementing the shared request contract. A lazy Angular template component uses Signal Forms, delegates HTTP and local persistence to `AuthService`, and composes the existing input and button atoms.

**Tech Stack:** Nx 23, Angular 22 standalone APIs and Signal Forms, Angular `HttpClient`, NestJS 11, Supabase types, SCSS.

## Global Constraints

- Use alias `@link-sharing/shared-models` for every shared-model import.
- Do not import implementation files across applications or from inside the shared library.
- Do not add tests or test files to `apps/link-sharing` or `apps/api`.
- Keep Angular zoneless and use standalone APIs, Signals, inline templates, OnPush, and lazy routes.
- Preserve existing uncommitted input-atom work and unrelated worktree changes.
- Keep “Create account” inactive and stay on `/login` after successful login.
- Store successful login response in `localStorage` and display an accessible inline success message.

---

### Task 1: Shared Auth Models

**Files:**
- Create: `libs/shared-models/project.json`
- Create: `libs/shared-models/tsconfig.json`
- Create: `libs/shared-models/tsconfig.lib.json`
- Create: `libs/shared-models/src/index.ts`
- Create: `libs/shared-models/src/lib/auth.models.ts`
- Modify: `tsconfig.base.json`
- Modify: `apps/api/src/app/auth/dto/auth-credentials.dto.ts`
- Modify: `apps/api/src/app/auth/dto/auth-response.dto.ts`

**Interfaces:**
- Produces: `AuthCredentials { email: string; password: string }`.
- Produces: `LoginResponse { user: User; accessToken: string; refreshToken: string; tokenType: string; expiresIn: number; expiresAt?: number }`.
- Consumes: `User` as a type-only import from `@supabase/supabase-js`.

- [ ] **Step 1: Dry-run non-buildable library generation**

Run:

```bash
npm exec -- nx g @nx/js:library libs/shared-models --name=shared-models --importPath=@link-sharing/shared-models --bundler=none --linter=eslint --unitTestRunner=none --minimal --no-interactive --dry-run
```

Expected: files under `libs/shared-models`, no test file, and alias entry in `tsconfig.base.json`.

- [ ] **Step 2: Generate the library**

Run the same command without `--dry-run`. Replace generated sample exports with:

```ts
// libs/shared-models/src/lib/auth.models.ts
import type { User } from '@supabase/supabase-js';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt?: number;
}
```

```ts
// libs/shared-models/src/index.ts
export type { AuthCredentials, LoginResponse } from './lib/auth.models';
```

- [ ] **Step 3: Adopt shared contracts in API**

Make `AuthCredentialsDto implements AuthCredentials`. Replace the duplicate API login response interface with a type re-export/import from `@link-sharing/shared-models`; keep `RegisterResponseDto` API-owned.

- [ ] **Step 4: Verify shared and API types**

Run:

```bash
npm exec -- nx run api:typecheck
npm exec -- nx run shared-models:lint
```

Expected: both commands exit 0.

### Task 2: Login-Capable Atoms

**Files:**
- Modify: `apps/link-sharing/src/app/atoms/input/input.component.ts`
- Modify: `apps/link-sharing/src/app/atoms/button/button.component.ts`

**Interfaces:**
- Produces: `InputIcon = 'email' | 'link' | 'password'` and `icon` signal input.
- Produces: `ButtonType = 'button' | 'submit'` and `type` signal input.
- Consumes: existing `Field<T>`, validation state, variants, and SCSS selectors without altering public defaults.

- [ ] **Step 1: Add explicit input icon variants**

Keep `link` as default for backwards compatibility. Render existing link SVG, Figma envelope SVG, or Figma lock SVG through built-in `@switch`, preserving `aria-hidden="true"` and current size/color classes.

- [ ] **Step 2: Add button native type**

Add:

```ts
export type ButtonType = 'button' | 'submit';
public readonly type = input<ButtonType>('button');
```

Bind `[type]="type()"` on the native button. Keep default behavior unchanged.

- [ ] **Step 3: Typecheck atoms**

Run `npm exec -- nx run link-sharing:typecheck`.

Expected: exit 0.

### Task 3: Angular Auth Service and Providers

**Files:**
- Create: `apps/link-sharing/src/app/auth/auth.service.ts`
- Modify: `apps/link-sharing/src/app/app.config.ts`

**Interfaces:**
- Consumes: `AuthCredentials` and `LoginResponse` from `@link-sharing/shared-models`.
- Produces: `login(credentials: AuthCredentials): Observable<LoginResponse>`.
- Produces: `saveSession(session: LoginResponse): void` using key `link-sharing.session`.

- [ ] **Step 1: Provide Angular HTTP**

Add `provideHttpClient()` to application providers.

- [ ] **Step 2: Implement auth service**

Inject `HttpClient`. POST credentials to `/api/auth/login`. Serialize successful responses to `localStorage` only from `saveSession`; do not add Supabase browser clients or secrets.

- [ ] **Step 3: Typecheck service**

Run `npm exec -- nx run link-sharing:typecheck`.

Expected: exit 0.

### Task 4: Figma Login Template and Route

**Files:**
- Create: `apps/link-sharing/src/app/templates/login-page/login-page.component.ts`
- Create: `apps/link-sharing/src/assets/scss/_login-page.scss`
- Create: `apps/link-sharing/public/images/logo-devlinks-large.svg`
- Modify: `apps/link-sharing/src/app/app.routes.ts`
- Modify: `apps/link-sharing/src/assets/scss/index.scss`

**Interfaces:**
- Consumes: `AuthService.login`, `AuthService.saveSession`, `InputComponent`, `ButtonComponent`, `AuthCredentials`.
- Produces: lazy `/login` route and default redirect.

- [ ] **Step 1: Add local logo asset**

Create an accessible logo asset matching the Figma Devlinks mark and wordmark; use `NgOptimizedImage` with explicit `183x40` dimensions and `priority`.

- [ ] **Step 2: Build Signal Form**

Create model signal `{ email: '', password: '' }`. Build form schema with:

```ts
required(path.email, { message: 'Email is required' });
email(path.email, { message: 'Enter a valid email address' });
required(path.password, { message: 'Password is required' });
minLength(path.password, 8, {
  message: 'Password must be at least 8 characters',
});
```

Expose field error messages only after touched/submitted state. Use `submit()` for validation and concurrent-submit protection, then call `firstValueFrom(this.auth.login(credentials))`.

- [ ] **Step 3: Implement submit outcomes**

Before each submission, clear stale API/success messages. On success, call `saveSession`, set “Login successful”, and remain on `/login`. Map status 401 to “Invalid email or password”; map other failures to “Unable to log in. Please try again.” Use `role="status"` for success and `role="alert"` for failure.

- [ ] **Step 4: Implement Figma layout**

Use inline component template and `_login-page.scss` with existing design tokens: `#fafafa` page, centered `183x40` logo, `476px` card, `40px` card padding, `12px` radius, `40px` header-to-form gap, `24px` control gap. At widths below 600px, remove card background/radius, use 24px page padding, align content from top, and retain full-width controls.

- [ ] **Step 5: Configure lazy routes and global SCSS**

Add `/login` via `loadComponent`, redirect `''` with `pathMatch: 'full'`, and import `login-page` from the SCSS index.

- [ ] **Step 6: Typecheck and lint frontend**

Run:

```bash
npm exec -- nx run link-sharing:typecheck
npm exec -- nx run link-sharing:lint
```

Expected: both commands exit 0.

### Task 5: Full Verification and Review

**Files:**
- Review all files changed by Tasks 1-4.

**Interfaces:**
- Consumes: completed login flow.
- Produces: verified implementation with no unrelated changes staged.

- [ ] **Step 1: Format targeted files**

Run Nx formatting on changed implementation files and inspect resulting diff so user-owned changes remain intact.

- [ ] **Step 2: Run repository verification**

Run:

```bash
npm exec -- nx run-many -t lint,typecheck,build -p link-sharing,api,shared-models
```

Expected: all available targets exit 0; Nx may skip targets absent from the non-buildable model library.

- [ ] **Step 3: Review diff**

Check alias-only shared imports, no test files, no browser Supabase client, no secrets, thin API controller/service boundaries unchanged, accessible form semantics, and no unrelated edits.

- [ ] **Step 4: Commit implementation**

Stage only login implementation files, shared library files, and required config changes. Commit with:

```bash
git commit -m "feat: add integrated login page"
```
