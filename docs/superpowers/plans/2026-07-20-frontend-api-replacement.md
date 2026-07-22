# Frontend and API Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Nx demo projects with blank Angular `frontend` and NestJS `api` apps wired to Prisma/Supabase PostgreSQL, Supabase Auth/Storage, and Redis cache.

**Architecture:** Angular remains a blank standalone client and proxies `/api` to NestJS during development. NestJS owns vendor adapters: Prisma for relational data, Supabase SDK for Auth/Storage, and Redis behind Nest cache abstraction. Configuration validation and health checks make integration failures visible without leaking credentials.

**Tech Stack:** Nx 23.1, Angular 22, NestJS, Prisma, Supabase JS, Redis, Vitest, Docker Compose.

## Global Constraints

- Remove `shop`, `shop-e2e`, old `api`, `feature-products`, `feature-product-detail`, `products`, `data`, `models`, and `shared-ui`.
- Keep frontend blank: no auth, storage, or product UI.
- Use `DATABASE_URL` for pooled runtime traffic and `DIRECT_URL` for Prisma migrations.
- Keep Supabase service-role key server-only.
- Use `REDIS_URL` for both Docker local Redis and managed Redis.
- Add no product-domain Prisma models or migrations.
- Run all project tasks through npm-prefixed Nx commands.

---

### Task 1: Replace demo projects with Angular and NestJS applications

**Files:**

- Remove: `apps/shop/**`, `apps/shop-e2e/**`, `apps/api/**`, demo package directories resolved by Nx
- Modify: `package.json`, `package-lock.json`, `nx.json`, `tsconfig.base.json`
- Create: `apps/frontend/**`, `apps/api/**`

**Interfaces:**

- Produces: Nx projects named `frontend` and `api`; `frontend` uses `/api` proxy; both expose build, serve, lint, test, and typecheck targets.

- [ ] **Step 1: Dry-run demo removal**

Run:

```bash
for project in shop-e2e shop feature-product-detail feature-products products data models shared-ui api; do npm exec -- nx g @nx/workspace:remove "$project" --forceRemove --dry-run --no-interactive; done
```

Expected: only files/config belonging to listed demo projects are deleted or updated.

- [ ] **Step 2: Remove demo projects**

Run removal for `shop-e2e`, `shop`, `feature-product-detail`, `feature-products`, `products`, `data`, `models`, `shared-ui`, then `api`, with `--forceRemove --no-interactive`.

- [ ] **Step 3: Add Nest plugin and inspect generator**

```bash
npm exec -- nx add @nx/nest@23.1.0
npm exec -- nx g @nx/nest:application --help
```

Read `node_modules/@nx/nest/generators.json` and application generator implementation before generation.

- [ ] **Step 4: Dry-run and generate API**

```bash
npm exec -- nx g @nx/nest:application apps/api --name=api --linter=eslint --unitTestRunner=vitest --e2eTestRunner=none --dry-run --no-interactive
npm exec -- nx g @nx/nest:application apps/api --name=api --linter=eslint --unitTestRunner=vitest --e2eTestRunner=none --no-interactive
```

Expected: Nest app root `apps/api`; no `api-e2e` project.

- [ ] **Step 5: Dry-run and generate frontend**

```bash
npm exec -- nx g @nx/angular:application apps/frontend --name=frontend --backendProject=api --routing --standalone --style=scss --bundler=esbuild --unitTestRunner=vitest-angular --e2eTestRunner=none --minimal --dry-run --no-interactive
npm exec -- nx g @nx/angular:application apps/frontend --name=frontend --backendProject=api --routing --standalone --style=scss --bundler=esbuild --unitTestRunner=vitest-angular --e2eTestRunner=none --minimal --no-interactive
```

Expected: blank Angular app root `apps/frontend`, proxy config targeting API, no E2E project.

- [ ] **Step 6: Verify project graph**

```bash
npm exec -- nx show projects --json
```

Expected: new `frontend` and `api` exist; every listed demo project is absent.

### Task 2: Add validated runtime configuration

**Files:**

- Create: `apps/api/src/app/config/environment.schema.ts`
- Create: `apps/api/src/app/config/environment.schema.spec.ts`
- Modify: `apps/api/src/app/app.module.ts`
- Modify: `.gitignore`

**Interfaces:**

- Produces: `validateEnvironment(config: Record<string, unknown>): RuntimeEnvironment`.
- Produces: validated keys `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, `REDIS_URL`.

- [ ] **Step 1: Add config dependencies**

```bash
npm install @nestjs/config zod
```

- [ ] **Step 2: Write failing validation tests**

Test valid parsing, numeric `PORT`, missing required key, invalid URL, and ensure thrown errors name keys but never include secret values.

- [ ] **Step 3: Run tests and confirm failure**

```bash
npm exec -- nx test api
```

Expected: FAIL because `validateEnvironment` does not exist.

- [ ] **Step 4: Implement Zod validation**

Define strict URL validation, default `PORT=3000`, and a redacted error message listing invalid key paths only. Register global `ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment })`.

- [ ] **Step 5: Run tests**

```bash
npm exec -- nx test api
```

Expected: validation tests PASS.

### Task 3: Add Prisma adapter for Supabase PostgreSQL

**Files:**

- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/src/app/prisma/prisma.module.ts`
- Create: `apps/api/src/app/prisma/prisma.service.ts`
- Create: `apps/api/src/app/prisma/prisma.service.spec.ts`
- Modify: `apps/api/src/app/app.module.ts`
- Modify: `apps/api/project.json`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**

- Produces: global `PrismaModule` and injectable `PrismaService`.
- Produces: `PrismaService.checkConnection(): Promise<void>` using parameterized Prisma API.

- [ ] **Step 1: Install Prisma**

```bash
npm install @prisma/client
npm install --save-dev prisma
```

Run `npm exec -- prisma --version` and `npm exec -- prisma generate --help`, then use the installed CLI's supported `prisma.config.ts`/schema datasource format. Lock resolved versions in `package-lock.json`; do not copy syntax from another Prisma major.

- [ ] **Step 2: Write failing lifecycle tests**

Verify `checkConnection()` performs a database ping and `onModuleDestroy()` disconnects client.

- [ ] **Step 3: Add schema and Nx targets**

Define PostgreSQL datasource using pooled runtime URL and direct migration URL, plus generated client. Add `prisma:generate`, `prisma:validate`, and `prisma:migrate` targets whose commands point to `apps/api/prisma/schema.prisma`.

- [ ] **Step 4: Implement Prisma module/service**

Create one client per Nest process, provide `checkConnection()`, close it during shutdown, and export service globally.

- [ ] **Step 5: Verify adapter**

```bash
npm exec -- nx run api:prisma:validate
npm exec -- nx run api:prisma:generate
npm exec -- nx test api
```

Expected: schema valid, client generated, lifecycle tests PASS.

### Task 4: Add Supabase Auth and Storage adapter

**Files:**

- Create: `apps/api/src/app/supabase/supabase.constants.ts`
- Create: `apps/api/src/app/supabase/supabase.module.ts`
- Create: `apps/api/src/app/supabase/supabase.service.ts`
- Create: `apps/api/src/app/supabase/supabase.service.spec.ts`
- Modify: `apps/api/src/app/app.module.ts`

**Interfaces:**

- Produces: global `SupabaseModule`, injectable `SupabaseService`.
- Produces: `SupabaseService.auth`, `SupabaseService.storage`, and `checkConnection(): Promise<void>`.

- [ ] **Step 1: Install Supabase SDK**

```bash
npm install @supabase/supabase-js
```

- [ ] **Step 2: Write failing adapter tests**

Mock `createClient`; verify singleton construction uses service-role key, session persistence is disabled, Auth/Storage accessors return SDK clients, and health failure is sanitized.

- [ ] **Step 3: Implement module/service**

Construct client once from validated config. Disable token refresh and session persistence. Implement bounded health probe that throws `Supabase unavailable` without provider payload.

- [ ] **Step 4: Run API tests**

```bash
npm exec -- nx test api
```

Expected: Supabase adapter tests PASS.

### Task 5: Add Redis-backed Nest cache

**Files:**

- Create: `apps/api/src/app/cache/cache.module.ts`
- Create: `apps/api/src/app/cache/cache.service.ts`
- Create: `apps/api/src/app/cache/cache.service.spec.ts`
- Modify: `apps/api/src/app/app.module.ts`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**

- Produces: global `AppCacheModule`, injectable `AppCacheService`.
- Produces: `get<T>(key: string)`, `set<T>(key: string, value: T, ttlMs?: number)`, `delete(key: string)`, `checkConnection()`.

- [ ] **Step 1: Install cache dependencies**

```bash
npm install @nestjs/cache-manager cache-manager @keyv/redis keyv
```

- [ ] **Step 2: Write failing cache tests**

Verify get/set/delete delegation, TTL forwarding, successful health round-trip, cleanup, and sanitized failure.

- [ ] **Step 3: Implement cache module/service**

Create Redis Keyv store from `REDIS_URL`; register `CacheModule` globally; expose typed wrapper and bounded health round-trip with unique short-lived key.

- [ ] **Step 4: Run API tests**

```bash
npm exec -- nx test api
```

Expected: cache tests PASS.

### Task 6: Add health endpoint and local infrastructure

**Files:**

- Create: `apps/api/src/app/health/health.controller.ts`
- Create: `apps/api/src/app/health/health.service.ts`
- Create: `apps/api/src/app/health/health.service.spec.ts`
- Create: `.env.example`
- Create: `compose.yaml`
- Modify: `apps/api/src/app/app.module.ts`
- Modify: `apps/api/src/main.ts`
- Modify: `apps/frontend/proxy.conf.json` or generated proxy file
- Modify: `apps/frontend/project.json`

**Interfaces:**

- Produces: `GET /api/health` returning status plus `database`, `redis`, and `supabase` dependency states.

- [ ] **Step 1: Write failing health tests**

Test all-healthy response and HTTP 503 result when any mocked provider fails. Assert output contains no provider error detail or credentials.

- [ ] **Step 2: Implement health service/controller**

Run dependency checks concurrently with bounded timeouts. Return `{ status: 'ok', dependencies: { database: 'up', redis: 'up', supabase: 'up' } }`; throw `ServiceUnavailableException` with only `up/down` states on failure.

- [ ] **Step 3: Add local environment files**

`.env.example` contains safe placeholders for every validated variable. `compose.yaml` defines `redis:7-alpine`, port `6379`, named volume, and `redis-cli ping` health check.

- [ ] **Step 4: Wire development serve flow**

Set Nest global prefix to `api`. Confirm Angular proxy maps `/api` to API port. Add `api:serve` dependency to `frontend:serve` without creating circular target dependencies.

- [ ] **Step 5: Run tests**

```bash
npm exec -- nx test api
```

Expected: health tests PASS.

### Task 7: Format, verify, and document commands

**Files:**

- Modify: `README.md`
- Modify: generated files only when verification finds scoped issues

**Interfaces:**

- Produces: documented local setup and deploy environment contract.

- [ ] **Step 1: Document workflow**

Document `docker compose up -d redis`, `.env.example` copy, Prisma generate/validate/migrate commands, `npm exec -- nx serve frontend`, and Render + Upstash + Supabase deployment mapping.

- [ ] **Step 2: Format workspace**

```bash
npm exec -- nx format:write
```

- [ ] **Step 3: Verify project targets**

```bash
npm exec -- nx run-many -t lint,test,typecheck,build -p frontend,api
npm exec -- nx run api:prisma:validate
npm exec -- nx run api:prisma:generate
```

Expected: all targets PASS.

- [ ] **Step 4: Verify Redis container when Docker exists**

```bash
docker compose config
docker compose up -d redis
docker compose ps redis
```

Expected: Compose config valid and Redis reports healthy. If Docker unavailable, report exact skipped runtime check; do not claim it passed.

- [ ] **Step 5: Final scope audit**

Run `npm exec -- nx show projects --json`, inspect Git diff if repository metadata exists, confirm no credentials or obsolete demo references remain, and report any checks requiring real Supabase credentials.
