# Shared Rules

## Nx Conventions

@rules/nx-rule.md

## Coding Guidelines

@rules/coding-guidelines.md

# Link Sharing Project

## Architecture

- This is an npm-based Nx monorepo.
- `apps/link-sharing` is the Angular 22 standalone frontend.
- `apps/api` is the NestJS 11 REST API.
- Prisma 7 accesses application data in Supabase PostgreSQL.
- Supabase provides Auth and Storage; Redis provides API caching.
- Keep application boundaries explicit. Do not import implementation files across apps.
- Create shared Nx libraries only when code has a real cross-project consumer.

## Angular Conventions

@rules/angular-conventions.md

## SCSS Conventions

@rules/scss-conventions.md

## Folder Structure Conventions

@rules/folder-structure-conventions.md

## NestJS Conventions

- Follow NestJS best practices and organize the API into cohesive feature modules.
- Do not create or add tests of any kind for the NestJS API.
- Follow MVC with this dependency flow: `Controller -> Service -> Repository -> Database`.
- Controllers handle HTTP input/output only and must remain thin.
- Services coordinate business rules and use cases; they must not query Prisma directly.
- Repositories own all database access, queries, persistence, and Prisma calls.
- Models/entities represent domain data; DTOs define validated API contracts.
- Inject dependencies through Nest providers; do not construct infrastructure clients in features.
- Export public providers from modules instead of importing another feature's internals.
- Validate request data with DTOs and validate environment variables at startup.
- Use Nest exceptions and centralized filters/interceptors for consistent API errors.
- Keep transport, business, and persistence concerns separate.

## Testing Conventions

- Do not create or add any tests for either `apps/link-sharing` or `apps/api`, including unit, integration, and end-to-end tests.
- Do not create test files of any naming convention or format in either application.

## Data and Infrastructure

- Inject `PrismaService` into repositories only.
- Never edit `apps/api/src/generated/prisma`; regenerate it through the Nx Prisma target.
- Prisma owns product-domain tables and migrations.
- Supabase owns its Auth and Storage schemas; do not manage them with Prisma migrations.
- Use the existing `SupabaseModule` and `SupabaseService` for backend Auth/Storage access.
- Privileged Supabase operations belong in the API, never in Angular.
- Access Redis through the Nest cache abstraction, not ad hoc Redis clients.
- Never expose `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, or `REDIS_URL`.

## Commands

```bash
npm exec -- nx serve link-sharing
npm exec -- nx serve api
npm exec -- nx run api:prisma:validate
npm exec -- nx run api:prisma:generate
npm exec -- nx run-many -t lint,typecheck,build -p link-sharing,api
```

- Run tasks through Nx so dependency ordering and caching remain effective.
- Before using an unfamiliar target or flag, inspect `nx show project <name> --json` or `--help`.
