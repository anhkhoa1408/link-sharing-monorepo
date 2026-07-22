# Shared Coding Rules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reusable coding guidelines and Angular image/form conventions while keeping `AGENTS.md` explicit and concise.

**Architecture:** Store general behavior guidance in `rules/coding-guidelines.md` and import it from a named section in `AGENTS.md`. Keep Angular-specific rules in the existing Angular conventions section.

**Tech Stack:** Markdown, Angular 22, Nx agent instructions

## Global Constraints

- Write the coding guidance in English.
- Include only sections 1–3 supplied by the user.
- Keep `rules/nx-rule.md` unchanged.
- Use `NgOptimizedImage` for static images.
- Use Angular Signal Forms from `@angular/forms/signals` for all forms.
- Preserve all unrelated `AGENTS.md` content.

---

### Task 1: Add shared coding guidance and Angular conventions

**Files:**
- Create: `rules/coding-guidelines.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: Existing `@rules/nx-rule.md` reference and Angular conventions.
- Produces: Named shared-rule sections, an imported coding-guidelines rule, and explicit Angular image/form rules.

- [ ] **Step 1: Create the coding guideline rule**

Create `rules/coding-guidelines.md` with exactly three numbered sections:

1. `Think Before Coding`: state assumptions, expose ambiguity, compare interpretations, mention simpler approaches, and stop to clarify uncertainty.
2. `Prefer Simplicity`: implement only requested behavior, avoid one-use abstractions and speculative flexibility, avoid impossible-case handling, and simplify disproportionate solutions.
3. `Make Targeted Changes`: touch only required lines, preserve local style, avoid unrelated refactors, report unrelated dead code, and remove only code made unused by the current change.

- [ ] **Step 2: Organize shared references in AGENTS.md**

Replace the initial standalone Nx reference with:

```md
# Shared Rules

## Nx Conventions

@rules/nx-rule.md

## Coding Guidelines

@rules/coding-guidelines.md
```

- [ ] **Step 3: Add Angular image and form rules**

Add this image rule to `## Angular Conventions`:

```md
- Use `NgOptimizedImage` for static images, provide explicit dimensions, and set `priority` on above-the-fold hero images.
```

Replace the typed reactive forms rule with:

```md
- Use Angular Signal Forms from `@angular/forms/signals` for all forms.
```

- [ ] **Step 4: Verify the documentation**

Run:

```bash
rg -n '^# Shared Rules|^## Nx Conventions|^## Coding Guidelines|@rules/' AGENTS.md
rg -n 'NgOptimizedImage|@angular/forms/signals|typed reactive forms' AGENTS.md
rg -n '^## [123]\.' rules/coding-guidelines.md
shasum -a 256 rules/nx-rule.md
```

Expected:

- Both rule references appear under named sections.
- `NgOptimizedImage` and Signal Forms appear once.
- The old typed reactive forms guidance is absent.
- The new coding rule contains exactly three numbered sections.
- The Nx rule checksum remains `45964d7171942305b5edb1354526b25179deb557856facfb7a6c5b839ebaee21`.

- [ ] **Step 5: Commit when Git metadata is available**

```bash
git add AGENTS.md rules/coding-guidelines.md docs/superpowers/specs/2026-07-22-shared-coding-rules-design.md docs/superpowers/plans/2026-07-22-shared-coding-rules.md
git commit -m "docs: add shared coding rules"
```

If the workspace has no `.git` metadata, report that the files are complete but uncommitted.
