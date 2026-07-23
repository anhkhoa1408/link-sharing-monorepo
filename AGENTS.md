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

## Style Conventions

@rules/style-conventions.md

## Folder Structure Conventions

@rules/folder-structure-conventions.md

## NestJS Conventions

@rules/nestjs-conventions.md

## Testing Conventions

- Do not create or add any tests for either `apps/link-sharing` or `apps/api`, including unit, integration, and end-to-end tests.
- Do not create test files of any naming convention or format in either application.

## Data and Infrastructure

- Use `PrismaService` only in repositories. Prisma owns product-domain tables and migrations; regenerate `apps/api/src/generated/prisma` through Nx instead of editing it.
- Supabase owns Auth and Storage schemas. Use the existing `SupabaseModule` and `SupabaseService`, keep privileged operations in the API, and never manage these schemas with Prisma.
- Access Redis through the Nest cache abstraction, not ad hoc clients.
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
