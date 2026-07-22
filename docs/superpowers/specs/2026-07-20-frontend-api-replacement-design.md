# Frontend and API Replacement Design

## Goal

Replace the Nx starter applications and product-demo libraries with a clean Angular frontend and a NestJS backend prepared for Supabase, Prisma, and Redis. The initial frontend remains intentionally empty; this work establishes project structure and infrastructure only.

## Removed Projects

Remove the existing starter projects and all demo libraries that support them:

- `shop`
- `shop-e2e`
- the existing `api`
- `feature-products`
- `feature-product-detail`
- `products`
- `data`
- `models`
- `shared-ui`

Nx configuration, TypeScript path aliases, and package dependencies left unused by those projects must also be cleaned up.

## New Projects

### Angular Frontend

Create `apps/frontend` as an Angular standalone application with routing, SCSS, ESLint, Vitest, build, typecheck, and serve targets. It contains only the generated shell and no authentication or product UI.

The frontend development server proxies backend requests to the NestJS API. Running the frontend serve target also starts the API through an Nx target dependency.

### NestJS API

Create `apps/api` as a NestJS REST application with ESLint, Vitest, build, typecheck, and serve targets. Organize infrastructure behind Nest modules and injectable services so feature modules do not depend directly on vendor SDK setup.

The API exposes a health endpoint that reports whether the process is running and verifies connectivity to Redis, Supabase, and the PostgreSQL database through Prisma without exposing credentials.

## Backend Integrations

### Configuration

Load configuration from environment variables and validate required values at startup. Provide `.env.example` with safe placeholders. Real `.env` files and credentials remain ignored by Git.

Required configuration includes:

- API port
- Supabase project URL
- Supabase publishable/anon key where appropriate
- Supabase service-role key for trusted server-side operations
- pooled PostgreSQL connection URL for application traffic
- direct PostgreSQL connection URL for Prisma migrations
- Redis connection URL

### Supabase

Provide a singleton Supabase client through a dedicated Nest module. The Supabase SDK handles Auth administration or token verification and Storage operations. Feature endpoints for sign-in, registration, or file handling are outside this initial scope.

The service-role key is backend-only and must never be included in Angular environment files or browser bundles.

### Prisma

Use Prisma as the API's database access layer for Supabase PostgreSQL. Feature modules depend on an injectable Prisma service rather than using the Supabase SDK for relational queries.

Keep the Prisma schema in the API project. Generate the client through Nx-managed targets and keep migrations in source control. Runtime traffic uses Supabase's pooled connection URL; migration commands use a direct connection URL so schema changes do not run through transaction pooling.

This initial scope creates the Prisma setup and connection lifecycle but no product-domain models. Supabase-managed Auth and Storage schemas remain outside Prisma ownership and must not be modified by Prisma migrations.

### Redis

Configure Redis as the backend's shared cache store through a dedicated Nest module. Application code accesses caching through an injected abstraction rather than constructing Redis connections directly.

Add a root `compose.yaml` with a Redis service for local development, a named volume for persistence, and a health check. The API connects through `REDIS_URL`, allowing the same code to use a managed Redis provider later.

## Local Development

The expected workflow is:

1. Start Redis with Docker Compose.
2. Copy `.env.example` to a local `.env` and provide Supabase credentials.
3. Generate the Prisma client and apply any checked-in migrations.
4. Run the Nx serve target for `frontend`, which starts both `frontend` and `api`.

Supabase itself remains hosted; this scope does not add a local Supabase stack or product-domain database migrations.

## Error Handling and Security

- Fail API startup with a clear validation error when required configuration is absent.
- Convert unavailable Redis or Supabase dependencies into an unhealthy health-check response rather than leaking connection details.
- Create one Prisma client per API process and close it during graceful shutdown.
- Never expose Prisma raw-query helpers through HTTP input; use parameterized Prisma APIs.
- Never log access tokens, service-role keys, Redis credentials, or full provider error payloads that may contain secrets.
- Use bounded connection and health-check timeouts so provider outages do not hang the API.

## Verification

After generation and integration:

- Nx recognizes only the intended new applications plus any required tooling projects.
- Formatting passes.
- Frontend and API lint, test, typecheck, and build targets pass.
- Prisma client generation succeeds and its schema validates.
- API unit tests cover configuration validation and health-service success/failure behavior using mocked Prisma, Redis, and Supabase providers.
- The Redis container becomes healthy locally.
- With valid local credentials, the health endpoint confirms Redis, Supabase API, and Prisma database connectivity.

Checks requiring the user's real Supabase credentials are documented but must not be faked or committed.

## Out of Scope

- Login, registration, or account-management screens
- Auth REST endpoints beyond integration primitives
- Storage upload/download endpoints or UI
- Product-domain features
- Supabase schema design and migrations
- Product-domain Prisma models and migrations
- Production deployment configuration
