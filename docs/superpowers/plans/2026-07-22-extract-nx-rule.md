# Extract Nx Rule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the Nx-managed instructions from `AGENTS.md` into `rules/nx-rule.md` and reference that rule from `AGENTS.md`.

**Architecture:** Keep Nx-specific instructions in one dedicated rule file. Keep repository-specific Angular, NestJS, Prisma, Supabase, and Redis guidance in the root `AGENTS.md`.

**Tech Stack:** Markdown, Nx monorepo agent instructions

## Global Constraints

- Preserve the Nx-managed block exactly, including marker comments.
- Use `@rules/nx-rule.md` as the first line of `AGENTS.md`.
- Do not change the project-specific guidance after the Nx block.
- Do not create or modify `CLAUDE.md`.

---

### Task 1: Extract and reference the Nx rule

**Files:**
- Create: `rules/nx-rule.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: The existing Nx-managed block at the beginning of `AGENTS.md`.
- Produces: `rules/nx-rule.md` containing that block and an `@rules/nx-rule.md` reference in `AGENTS.md`.

- [ ] **Step 1: Create the dedicated Nx rule**

Before editing, capture the complete content from `<!-- nx configuration start-->` through `<!-- nx configuration end-->` in `/tmp/nx-rule-original.md`. Create `rules/nx-rule.md` with exactly the captured content.

- [ ] **Step 2: Replace the original block with the reference**

Replace the Nx-managed block and its following blank line in `AGENTS.md` with:

```md
@rules/nx-rule.md

```

- [ ] **Step 3: Verify the extraction**

Run:

```bash
head -n 3 AGENTS.md
rg -n 'nx configuration (start|end)' AGENTS.md rules/nx-rule.md
cmp rules/nx-rule.md /tmp/nx-rule-original.md
```

Expected:

- `AGENTS.md` starts with `@rules/nx-rule.md`.
- Nx marker comments exist only in `rules/nx-rule.md`.
- `cmp` exits successfully after `/tmp/nx-rule-original.md` is captured from the original block before editing.
- The remainder of `AGENTS.md` matches its pre-edit content.

- [ ] **Step 4: Commit when Git metadata is available**

```bash
git add AGENTS.md rules/nx-rule.md docs/superpowers/specs/2026-07-22-extract-nx-rule-design.md docs/superpowers/plans/2026-07-22-extract-nx-rule.md
git commit -m "docs: extract Nx agent rules"
```

If the workspace has no `.git` metadata, report that the files are complete but uncommitted.
