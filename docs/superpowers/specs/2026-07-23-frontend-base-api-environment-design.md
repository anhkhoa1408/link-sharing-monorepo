# Frontend Base API Environment Design

## Goal

Configure the Angular frontend to obtain its base API path from an environment file while preserving the existing local development proxy.

## Design

- Add `apps/link-sharing/src/environments/environment.ts`.
- Export an environment object with `baseApi` set to `/api`.
- Update `AuthApiService` to pass `environment.baseApi` to `BaseApiService` instead of the hard-coded `/api` string.
- Keep `apps/link-sharing/proxy.conf.json` unchanged. It already forwards `/api` requests to `http://localhost:3333`.

## Request Flow

For example, login will use the following path:

1. `AuthApiService` builds `/api/auth/login`.
2. The Angular development server matches `/api` in the proxy configuration.
3. The proxy forwards the request to `http://localhost:3333/api/auth/login`.

## Scope

This change only configures the current frontend development API base path. It does not add a production API URL, runtime configuration, an injection token, or tests.

## Verification

Run the frontend lint, typecheck, and build targets through Nx. No test files will be created, following the repository testing conventions.
