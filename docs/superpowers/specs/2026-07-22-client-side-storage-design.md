# Client-Side Storage Design

## Goal

Provide an SSR-safe, generic JSON abstraction over browser `localStorage` for the Angular application.

## Scope

- Add a `ClientSideStorage` interface with `get`, `set`, `delete`, and `clear` methods.
- Add a root-provided `LocalStorageService` that implements the interface.
- Add a `StorageKey` constants class containing `ACCESS_TOKEN`.
- Do not change `AuthService`; its existing session key and stored value have different semantics from the requested access-token key.
- Do not add tests, as application tests are prohibited by the repository conventions.

## File Structure

All storage abstractions live together under `apps/link-sharing/src/app/storage/`:

- `client-side-storage.ts`: the public storage contract.
- `local-storage.service.ts`: the browser `localStorage` implementation and SSR guard.
- `storage-key.ts`: centralized storage-key constants.

## Interface

```ts
export interface ClientSideStorage {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  delete(key: string): void;
  clear(): void;
}
```

`get<T>` returns `null` when the key is absent. `set<T>` accepts JSON-serializable data. Type safety at read time is compile-time only; the caller must request the same type that was previously stored.

## Local Storage Behavior

`LocalStorageService` is an Angular root provider. It injects `PLATFORM_ID` and evaluates `isPlatformBrowser` before accessing the global `localStorage` object.

In a browser:

- `set` serializes values with `JSON.stringify` and calls `localStorage.setItem`.
- `get` calls `localStorage.getItem`, returns `null` for a missing key, and otherwise deserializes with `JSON.parse`.
- `delete` calls `localStorage.removeItem`.
- `clear` calls `localStorage.clear`.

During SSR:

- `get` returns `null`.
- `set`, `delete`, and `clear` are no-ops.

The service does not catch browser storage, serialization, or parsing errors. Malformed JSON, circular values, quota failures, and security errors propagate to the caller as requested.

## Storage Keys

`StorageKey` cannot be instantiated and exposes constants as `public static readonly` members:

```ts
export class StorageKey {
  public static readonly ACCESS_TOKEN = 'ACCESS_TOKEN';

  private constructor() {}
}
```

New application-wide keys can be added to this class when they have a real consumer.

## Verification

Run the Angular project through Nx:

```bash
npm exec -- nx lint link-sharing
npm exec -- nx run link-sharing:typecheck
npm exec -- nx build link-sharing
```

Success means all three targets exit successfully and no test files are introduced.
