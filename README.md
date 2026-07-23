# Link Sharing

Nx monorepo containing blank Angular frontend and NestJS API.

## Stack

- `apps/link-sharing`: Angular standalone app with routing
- `apps/api`: NestJS REST API
- `libs/shared-models`: shared frontend/backend TypeScript contracts
- Prisma: Supabase PostgreSQL data access
- Supabase SDK: Auth and Storage
- Redis: Nest cache, local Docker or managed Redis

## Project architecture

```text
link-sharing/
├── apps/
│   ├── link-sharing/              # Angular frontend
│   │   ├── public/                # Static public files
│   │   └── src/
│   │       ├── app/
│   │       │   ├── api/           # Backend API clients
│   │       │   ├── atoms/         # Small reusable UI components
│   │       │   ├── molecules/     # Compositions of atoms
│   │       │   ├── organisms/     # Feature-level UI sections
│   │       │   ├── templates/     # Shared page layouts
│   │       │   ├── pages/         # Route-level features
│   │       │   └── core/          # App-wide services, guards, interceptors,
│   │       │                       # models, constants, and utilities
│   │       ├── assets/            # SCSS and design tokens
│   │       └── environments/      # Angular environment configuration
│   └── api/                       # NestJS REST API
│       ├── prisma/
│       │   ├── schema.prisma      # Product-domain database schema
│       │   └── migrations/        # Prisma migrations
│       └── src/
│           ├── app/
│           │   ├── auth/          # Authentication
│           │   ├── avatar/        # Avatar upload and storage
│           │   ├── link/          # Link management and public links
│           │   ├── profile/       # User and public profile features
│           │   ├── cache/         # Nest cache abstraction
│           │   ├── prisma/        # Prisma integration
│           │   ├── supabase/      # Supabase integration
│           │   ├── config/        # Environment validation
│           │   └── health/        # Health endpoint
│           └── generated/prisma/  # Generated Prisma client; do not edit
├── libs/
│   └── shared-models/             # Contracts shared by both applications
├── rules/                         # Repository coding conventions
├── tools/                         # Workspace automation
├── nx.json                        # Nx workspace configuration
└── package.json                   # Dependencies and npm scripts
```

The frontend follows Atomic Design for reusable UI and keeps route-specific
code under `pages`. The API is organized by NestJS feature modules; database
access stays in repositories through `PrismaService`. Cross-application
contracts are exported from `libs/shared-models`.

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
