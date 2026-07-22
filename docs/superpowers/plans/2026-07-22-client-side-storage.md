# Client-Side Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an SSR-safe, generic JSON interface and Angular `localStorage` service, centralize the access-token key, and use the abstraction from `AuthService`.

**Architecture:** Keep frontend-only infrastructure inside `apps/link-sharing/src/app/core`, separated into model, service, and constant folders. The root-provided service implements the generic interface, guards all browser-global access with Angular platform detection, and lets browser storage or JSON errors propagate.

**Tech Stack:** Angular 22, TypeScript, Nx, browser Web Storage API

## Global Constraints

- Follow the repository's Angular member visibility and explicit return-type conventions.
- Use Angular Style Guide file and class naming.
- Keep the service injectable with `@Injectable({ providedIn: 'root' })`.
- During SSR, `get` returns `null` and mutation methods are no-ops.
- In the browser, JSON and storage errors must propagate to the caller.
- Do not create or add tests for `apps/link-sharing`.
- Run verification through Nx.
- Preserve `AuthService.save(session: LoginResponse): void` while storing only `session.accessToken` through the new service.

---

### Task 1: Define the storage contract and key constant

**Files:**
- Create: `apps/link-sharing/src/app/core/models/client-side-storage.model.ts`
- Create: `apps/link-sharing/src/app/core/constants/storage-key.constant.ts`

**Interfaces:**
- Consumes: No application code.
- Produces: `ClientSideStorage` with `get<T>(key: string): T | null`, `set<T>(key: string, value: T): void`, `delete(key: string): void`, and `clear(): void`; `StorageKey.ACCESS_TOKEN` with value `'ACCESS_TOKEN'`.

- [ ] **Step 1: Create the generic client-side storage contract**

```ts
export interface ClientSideStorage {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  delete(key: string): void;
  clear(): void;
}
```

- [ ] **Step 2: Create the storage-key constant class without a constructor**

```ts
export class StorageKey {
  public static readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
}
```

- [ ] **Step 3: Run the frontend typecheck**

Run: `npm exec -- nx run link-sharing:typecheck`

Expected: Nx reports the `link-sharing:typecheck` target succeeded.

- [ ] **Step 4: Commit the contract and constant**

```bash
git add apps/link-sharing/src/app/core/models/client-side-storage.model.ts apps/link-sharing/src/app/core/constants/storage-key.constant.ts
git commit -m "feat: add client storage contract"
```

### Task 2: Implement the SSR-safe local-storage service

**Files:**
- Create: `apps/link-sharing/src/app/core/services/local-storage.service.ts`

**Interfaces:**
- Consumes: `ClientSideStorage` from `../models/client-side-storage.model` and Angular `PLATFORM_ID`, `inject`, `Injectable`, and `isPlatformBrowser` APIs.
- Produces: Root-provided `LocalStorageService implements ClientSideStorage`.

- [ ] **Step 1: Implement the Angular service and platform guard**

```ts
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import type { ClientSideStorage } from '../models/client-side-storage.model';

@Injectable({ providedIn: 'root' })
export class LocalStorageService implements ClientSideStorage {
  private readonly isBrowser: boolean = isPlatformBrowser(inject(PLATFORM_ID));

  public get<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }

    const value = localStorage.getItem(key);

    return value === null ? null : (JSON.parse(value) as T);
  }

  public set<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      return;
    }

    const serializedValue = JSON.stringify(value);

    if (serializedValue === undefined) {
      throw new TypeError('Value is not JSON-serializable.');
    }

    localStorage.setItem(key, serializedValue);
  }

  public delete(key: string): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(key);
  }

  public clear(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.clear();
  }
}
```

- [ ] **Step 2: Run focused frontend checks**

Run: `npm exec -- nx run-many -t lint,typecheck -p link-sharing`

Expected: Nx reports both targets succeeded.

- [ ] **Step 3: Commit the service**

```bash
git add apps/link-sharing/src/app/core/services/local-storage.service.ts
git commit -m "feat: add local storage service"
```

### Task 3: Integrate storage with AuthService

**Files:**
- Modify: `apps/link-sharing/src/app/core/auth.service.ts`

**Interfaces:**
- Consumes: `LocalStorageService.set<string>(key: string, value: string): void`, `StorageKey.ACCESS_TOKEN`, and `LoginResponse.accessToken`.
- Produces: `AuthService.save(session: LoginResponse): void`, preserving the API used by `LoginComponent`.

- [ ] **Step 1: Replace direct localStorage access with the storage service**

```ts
import { inject, Injectable } from '@angular/core';
import type { LoginResponse } from '@link-sharing/shared-models';
import { StorageKey } from './constants/storage-key.constant';
import { LocalStorageService } from './services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(LocalStorageService);

  public save(session: LoginResponse): void {
    this.storage.set(StorageKey.ACCESS_TOKEN, session.accessToken);
  }
}
```

- [ ] **Step 2: Run focused frontend checks**

Run: `npm exec -- nx run-many -t lint,typecheck -p link-sharing`

Expected: Nx reports both targets succeeded.

- [ ] **Step 3: Commit the AuthService integration**

```bash
git add apps/link-sharing/src/app/core/auth.service.ts
git commit -m "refactor: use local storage service for auth"
```

### Task 4: Verify the completed frontend change

**Files:**
- Verify only: `apps/link-sharing/src/app/core/models/client-side-storage.model.ts`
- Verify only: `apps/link-sharing/src/app/core/constants/storage-key.constant.ts`
- Verify only: `apps/link-sharing/src/app/core/services/local-storage.service.ts`
- Verify only: `apps/link-sharing/src/app/core/auth.service.ts`

**Interfaces:**
- Consumes: All artifacts produced by Tasks 1 through 3.
- Produces: A linted, typechecked, production-buildable Angular application.

- [ ] **Step 1: Confirm no prohibited test files were introduced**

Run: `find apps/link-sharing/src/app/core -type f \( -name '*.spec.ts' -o -name '*.test.ts' \)`

Expected: No output.

- [ ] **Step 2: Run the full relevant Nx verification**

Run: `npm exec -- nx run-many -t lint,typecheck,build -p link-sharing`

Expected: Nx reports all three targets succeeded.

- [ ] **Step 3: Check the diff for whitespace errors**

Run: `git diff --check`

Expected: No output and exit code 0.

- [ ] **Step 4: Inspect the working-tree status**

Run: `git status --short`

Expected: The implementation contains only the planned storage files and `AuthService` integration; unrelated pre-existing user changes remain untouched.
