# Link Sharing

Nx monorepo containing blank Angular frontend and NestJS API.

## Stack

- `apps/link-sharing`: Angular standalone app with routing
- `apps/api`: NestJS REST API
- Prisma: Supabase PostgreSQL data access
- Supabase SDK: Auth and Storage
- Redis: Nest cache, local Docker or managed Redis

## Local setup

Install dependencies:

```bash
npm install
```

Create local configuration:

```bash
cp .env.example .env
```

Replace Supabase placeholders in `.env`. Keep `SUPABASE_SERVICE_ROLE_KEY` on backend only.

Start Redis:

```bash
docker compose up -d redis
```

Validate and generate Prisma client:

```bash
npm exec -- nx run api:prisma:validate
npm exec -- nx run api:prisma:generate
```

Run frontend and API together:

```bash
npm exec -- nx serve link-sharing
```

- Frontend: `http://localhost:4200`
- API health: `http://localhost:3333/api/health`

Run API alone:

```bash
npm exec -- nx serve api
```

## Prisma migrations

Runtime uses pooled `DATABASE_URL`. Migration commands use direct `DIRECT_URL` from `apps/api/prisma.config.ts`.

```bash
npm exec -- nx run api:prisma:migrate
```

No product-domain models or migrations exist yet. Supabase Auth and Storage schemas stay outside Prisma ownership.

## Verification

```bash
npm exec -- nx run-many -t lint,test,typecheck,build -p link-sharing,api
```

## Free deployment example

- Angular: Cloudflare Pages or Vercel
- NestJS API: Render Free
- Redis: Upstash Free; set production `REDIS_URL`
- Database/Auth/Storage: Supabase Free

Configure all `.env.example` variables in backend hosting. Never expose `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, or `REDIS_URL` to Angular.
