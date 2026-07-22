# CLAUDE.md Project Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand `CLAUDE.md` into a concise project-specific guide for the Angular/NestJS Nx monorepo.

**Architecture:** Preserve the Nx-managed block verbatim and append repository-specific conventions. Describe the frontend, backend, persistence, security boundaries, and standard commands without adding testing guidance.

**Tech Stack:** Nx 23, Angular 22, NestJS 11, Prisma 7, Supabase, PostgreSQL, Redis, npm

## Global Constraints

- Write in concise English.
- Keep the complete `CLAUDE.md` below 125 lines.
- Do not modify the Nx-managed block between its marker comments.
- Exclude testing guidance.
- Prefer Angular zoneless change detection, Signals, and `ChangeDetectionStrategy.OnPush`.
- Follow MVC on the API and isolate all Prisma/database access in repositories.

---

### Task 1: Add project-specific contributor guidance

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: Existing Nx-managed guidance and the current workspace layout.
- Produces: A single authoritative guide for AI contributors.

- [ ] **Step 1: Preserve the managed Nx section**

Read the content between `<!-- nx configuration start-->` and `<!-- nx configuration end-->` and leave it byte-for-byte unchanged.

- [ ] **Step 2: Append the repository guidance**

Add concise sections covering:

- Project overview and application paths.
- Angular standalone, zoneless, Signals, OnPush, lazy routing, typed forms, accessibility, and thin components.
- NestJS feature modules using `Controller -> Service -> Repository -> Prisma/database`.
- DTO/config validation, dependency injection, Nest exceptions, and feature boundaries.
- Prisma, Supabase Auth/Storage, Redis, generated-code, and secret-ownership rules.
- Nx-based development, lint, typecheck, and build commands only.

- [ ] **Step 3: Verify content and length**

Run:

```bash
wc -l CLAUDE.md
rg -n 'zoneless|signal|OnPush|Controller.*Service.*Repository|Supabase|Prisma|Redis' CLAUDE.md
```

Expected: fewer than 125 lines, with every required architecture term present.

- [ ] **Step 4: Verify the workspace commands remain valid**

Run:

```bash
npm exec nx show projects -- --json
```

Expected: JSON containing `link-sharing` and `api`.

- [ ] **Step 5: Commit when Git metadata is available**

```bash
git add CLAUDE.md docs/superpowers/specs/2026-07-22-claude-project-guide-design.md docs/superpowers/plans/2026-07-22-claude-project-guide.md
git commit -m "docs: add project guidance for Claude"
```

If the workspace has no `.git` metadata, report that the files are complete but uncommitted.
