# Auth Callback and Home Guard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist a still-valid Supabase signup access token, redirect authenticated logins to `/home`, and guard `/home` against missing or expired tokens.

**Architecture:** Centralize token persistence and JWT-expiry checks in `AuthService`. Let `LoginComponent` coordinate URL-fragment callbacks and let a functional `authGuard` reuse the service for route access decisions.

**Tech Stack:** Nx 23, Angular 22 standalone APIs, functional router guards, browser local storage, TypeScript.

## Global Constraints

- Work directly on the existing `main` branch.
- Store only the access token under the existing `ACCESS_TOKEN` key.
- Do not create a `/profile` route or page.
- Do not add test files because repository rules prohibit tests in both applications.
- Do not modify generated Prisma code, API behavior, Supabase schemas, or existing unrelated worktree changes.

---

### Task 1: Centralize Access-Token Validity

**Files:**
- Modify: `apps/link-sharing/src/app/core/auth.service.ts`

**Interfaces:**
- Produces: `save(session: LoginResponse): boolean`.
- Produces: `saveAccessToken(accessToken: string): boolean`.
- Produces: `isAuthenticated(): boolean`.
- Consumes: `LocalStorageService` and `StorageKey.ACCESS_TOKEN`.

- [ ] **Step 1: Implement JWT expiry decoding**

Add a private helper that splits the JWT, base64url-decodes its payload, parses `{ exp?: unknown }`, and returns a finite numeric expiry. Reject malformed values without throwing to callers.

- [ ] **Step 2: Implement validity-aware persistence**

Make `saveAccessToken()` compare `exp` against `Date.now() / 1000`, delete stale storage on rejection, and persist the raw token only on success. Have `save()` delegate to it.

- [ ] **Step 3: Implement the guard-facing query**

Make `isAuthenticated()` read the stored string, validate it through the same expiry logic, remove invalid/stale values, and return the result.

### Task 2: Add the Functional Auth Guard

**Files:**
- Create: `apps/link-sharing/src/app/core/guards/auth.guard.ts`
- Modify: `apps/link-sharing/src/app/app.routes.ts`

**Interfaces:**
- Produces: `authGuard: CanActivateFn`.
- Consumes: `AuthService.isAuthenticated()` and `Router.createUrlTree(['/login'])`.

- [ ] **Step 1: Create the guard**

Inject `AuthService` and `Router`. Return `true` for a valid token and a `/login` URL tree otherwise.

- [ ] **Step 2: Protect home**

Add `canActivate: [authGuard]` only to the lazy `/home` route. Leave `/login` and `/register` public and do not add `/profile`.

### Task 3: Handle Signup Callback and Successful Login Navigation

**Files:**
- Modify: `apps/link-sharing/src/app/pages/login/login.component.ts`

**Interfaces:**
- Consumes: `ActivatedRoute.snapshot.fragment`, `AuthService.saveAccessToken()`, `AuthService.save()`, and `Router.navigateByUrl()`.

- [ ] **Step 1: Process the fragment at page creation**

Parse the fragment with `URLSearchParams`. If callback auth fields are present, require `access_token`, require a supplied `expires_at` to be a finite future epoch timestamp, and then require `AuthService.saveAccessToken()` to succeed.

- [ ] **Step 2: Handle callback outcomes**

For a valid callback, call `navigateByUrl('/home', { replaceUrl: true })`. For invalid or expired callbacks, do not persist the callback token and set `errorMessage` to `The sign-up link is invalid or has expired. Please try again.`

- [ ] **Step 3: Redirect password login**

After a valid API login response is stored, navigate to `/home` with `replaceUrl: true`; treat a rejected/expired API token as a login failure.

### Task 4: Verify the Frontend

**Files:**
- Review: all files changed by Tasks 1–3.

- [ ] **Step 1: Run lint**

Run `npm exec -- nx run link-sharing:lint`. Expected: exit code 0.

- [ ] **Step 2: Run typecheck**

Run `npm exec -- nx run link-sharing:typecheck`. Expected: exit code 0.

- [ ] **Step 3: Run production build**

Run `npm exec -- nx run link-sharing:build`. Expected: exit code 0.

- [ ] **Step 4: Review scope and whitespace**

Run `git diff --check` and inspect the targeted diff. Confirm `/profile` remains absent, only `ACCESS_TOKEN` is stored, and unrelated user changes are preserved.
