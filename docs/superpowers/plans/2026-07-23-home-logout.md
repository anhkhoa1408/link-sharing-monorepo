# Home Logout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Logout action immediately left of Preview that clears the local access token and returns the user to `/login`.

**Architecture:** Keep storage mutation in `AuthService`. Let the focused home-header component coordinate the button interaction and router navigation while reusing the existing button atom and design tokens.

**Tech Stack:** Nx 23, Angular 22 standalone APIs, Angular Router, SCSS.

## Global Constraints

- Work directly on the existing `main` branch.
- Do not add tests or test files.
- Do not add a backend logout endpoint or Supabase browser client.
- Do not modify or commit unrelated worktree changes.

---

### Task 1: Add Local Logout Operation

**Files:**
- Modify: `apps/link-sharing/src/app/core/auth.service.ts`

**Interfaces:**
- Produces: `logout(): void`.

- [ ] **Step 1: Remove the stored access token**

Add a public `logout(): void` method that deletes `StorageKey.ACCESS_TOKEN` through `LocalStorageService`.

### Task 2: Add the Header Action

**Files:**
- Modify: `apps/link-sharing/src/app/pages/home/_components/home-header.component.ts`
- Modify: `apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts`

**Interfaces:**
- Consumes: `AuthService.logout()` and `Router.navigateByUrl()`.

- [ ] **Step 1: Render Logout before Preview**

Replace the single preview wrapper with a flex actions wrapper. Render a secondary Logout button before the unchanged secondary Preview button.

- [ ] **Step 2: Handle logout**

Inject `AuthService` and `Router`. Add `onLogout(): void`, clear auth storage, then navigate to `/login` with `{ replaceUrl: true }`.

- [ ] **Step 3: Keep the action group responsive**

Use existing spacing tokens for the flex gap, switch the header to its compact grid before the action group can overlap navigation, and show tab icons without visual labels below 720px while preserving accessible text.

### Task 3: Verify and Commit

- [ ] **Step 1: Run `npm exec -- nx run link-sharing:lint`**

Expected: exit code 0.

- [ ] **Step 2: Run `npm exec -- nx run link-sharing:typecheck`**

Expected: exit code 0.

- [ ] **Step 3: Run `npm exec -- nx run link-sharing:build`**

Expected: exit code 0.

- [ ] **Step 4: Review and commit only the intended files**

Run `git diff --check`, inspect the focused diff, and leave unrelated user changes untouched.
