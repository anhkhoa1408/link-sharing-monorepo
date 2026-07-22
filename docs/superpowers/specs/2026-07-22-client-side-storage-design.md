# Client-Side Storage Design

## Goal

Provide an SSR-safe, generic JSON abstraction over browser `localStorage` for the Angular application.

## Scope

- Add a `ClientSideStorage` interface with `get`, `set`, `delete`, and `clear` methods.
- Add a root-provided `LocalStorageService` that implements the interface.
- Add a `StorageKey` constants class containing `ACCESS_TOKEN`.
- Update the frontend `AuthService` to store `LoginResponse.accessToken` through `LocalStorageService` using `StorageKey.ACCESS_TOKEN`.
- Do not add tests, as application tests are prohibited by the repository conventions.

## File Structure

Storage concerns live under the Angular application's non-exposed `core` area and are grouped by responsibility:

- `apps/link-sharing/src/app/core/models/client-side-storage.model.ts`: the internal storage contract.
- `apps/link-sharing/src/app/core/services/local-storage.service.ts`: the Angular service implementing browser `localStorage` with an SSR guard. Its file and class names follow the Angular Style Guide, and it uses `@Injectable({ providedIn: 'root' })`.
- `apps/link-sharing/src/app/core/constants/storage-key.constant.ts`: centralized storage-key constants.
- `apps/link-sharing/src/app/core/auth.service.ts`: the existing authentication service, modified to use the storage abstraction.

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

`StorageKey` exposes constants as `public static readonly` members:

```ts
export class StorageKey {
  public static readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
}
```

## Authentication Integration

`AuthService` injects `LocalStorageService` and keeps its existing `save(session: LoginResponse): void` API so `LoginComponent` does not change. The method stores only `session.accessToken` under `StorageKey.ACCESS_TOKEN`; it does not store the complete login response under an access-token key.

## Verification

Run the Angular project through Nx:

```bash
npm exec -- nx lint link-sharing
npm exec -- nx run link-sharing:typecheck
npm exec -- nx build link-sharing
```

Success means all three targets exit successfully and no test files are introduced.
