# Folder Structure Conventions

All paths in this document are relative to `apps/link-sharing/src/app`.

## Scope

- Organize code by its narrowest real scope. Keep application-wide code in `core`; keep code used by only one page inside that page.
- Move page-scoped code into `core` only after it has a genuine application-wide consumer.
- Follow the official Angular filename conventions for every TypeScript file.

## Core

- Place globally injected services, including services that use `providedIn: 'root'`, in `core/services`. Use the `.service.ts` suffix, for example `core/services/local-storage.service.ts`.
- Place API integration services in `core/api`. Derive each API service name from its matching backend controller; for example, `AuthController` maps to `core/api/auth-api.service.ts`.
- Place application-wide directives in `core/directives`.
- Place application-wide route guards in `core/guards`.
- Place application-wide HTTP interceptors in `core/interceptors`.
- Place shared TypeScript models, interfaces, and type aliases in `core/models`.
- Place application-wide constants in `core/constants`.
- Place application-wide utility functions and helpers in `core/utils`.

## Page Scope

- Place a service used by only one page in `pages/<page>/_services` and provide it at the page or route scope, not globally. For example: `pages/login/_services/login.service.ts`.
- Place page-only directives in `pages/<page>/_directives`.
- Place page-only route guards in `pages/<page>/_guards`.
- Place page-only models, constants, and utilities in `pages/<page>/_models`, `pages/<page>/_constants`, and `pages/<page>/_utils`.
- Use the same underscore-prefixed pattern for other page-private implementation groups when needed, and do not expose them as application-wide dependencies.
