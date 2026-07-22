# CLAUDE.md Project Guide Design

## Goal

Expand the existing `CLAUDE.md` into a concise, project-specific guide for AI contributors working in this Nx monorepo. Keep the complete file under 125 lines and preserve the Nx-managed block unchanged.

## Content

The guide will document the current workspace: the Angular 22 standalone frontend in `apps/link-sharing`, the NestJS 11 API in `apps/api`, and the supporting Prisma, Supabase, PostgreSQL, and Redis integrations.

It will define focused conventions for:

- Nx monorepo boundaries, generators, and task execution through npm and Nx.
- Angular standalone architecture with zoneless change detection as the default.
- Signals for local and derived state, and `ChangeDetectionStrategy.OnPush` for components to minimize unnecessary change detection.
- Lazy routes, typed forms, accessible templates, and thin UI components.
- NestJS feature modules following MVC: controllers handle transport concerns, services coordinate business use cases, and models/DTOs define application data and API contracts.
- A repository layer for every feature that accesses persistent data. Only repositories call Prisma or the database; controllers and services must not query Prisma directly.
- Prisma as the API's application-data access layer, injected into repositories, with generated Prisma code treated as read-only.
- Supabase Auth and Storage accessed through the backend `SupabaseModule` and `SupabaseService`, rather than initialized ad hoc inside feature code.
- Clear ownership boundaries: Prisma owns application tables in PostgreSQL; Supabase owns its Auth and Storage schemas.
- Backend-only secrets and privileged Supabase operations. The service-role key, database URLs, and Redis URL must never enter Angular code or browser bundles.
- Redis access through the Nest cache abstraction instead of direct clients scattered across feature modules.

## NestJS and Supabase Shape

New backend capabilities will live in cohesive NestJS feature modules under `apps/api/src/app` and follow an MVC-oriented flow: `Controller -> Service -> Repository -> Prisma/database`. Controllers will handle HTTP concerns only, services will hold business workflows, repositories will encapsulate queries and persistence, and models/DTOs will define data shapes and API contracts. Infrastructure integrations will be injected through dedicated modules. Cross-feature dependencies must use exported providers rather than reaching into another feature's internals.

The API will remain the trust boundary for privileged Supabase access. Angular may use only explicitly public Supabase configuration when a browser-side Auth flow requires it; it must never receive the service-role key. Authentication data and Storage metadata remain under Supabase ownership, while product-domain records are modeled and migrated through Prisma.

Testing guidance will be intentionally excluded. Verification commands will cover only lint, typecheck, and build.

## Constraints

- Write in concise English.
- Keep `CLAUDE.md` below 125 lines.
- Do not replace or edit the Nx-managed section between its marker comments.
- Prefer rules that apply to this repository over generic framework documentation.
- Avoid prescribing new libraries or architecture not already required by the project.
