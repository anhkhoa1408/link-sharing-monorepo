# Rename Frontend Project to Link Sharing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename the Angular application from `frontend` to `link-sharing` at both the Nx project and filesystem levels without changing application behavior.

**Architecture:** Use Nx's workspace move generator so project configuration, target references, and filesystem paths change as one operation. Inspect the dry-run first, then verify the resolved Nx configuration and run every existing quality target on the renamed project.

**Tech Stack:** Nx 23.1, Angular 22, npm, ESLint, Angular unit test runner, TypeScript

## Global Constraints

- Move `apps/frontend` to `apps/link-sharing`.
- Rename the Nx project from `frontend` to `link-sharing`.
- Keep the API project and application functionality unchanged.
- Update active documentation commands, but do not rewrite historical design and implementation-plan documents.
- This workspace is not currently recognized as a Git repository, so commit steps are omitted.

---

### Task 1: Rename the Angular application

**Files:**

- Move: `apps/frontend/**` → `apps/link-sharing/**`
- Modify through generator: `apps/link-sharing/project.json`
- Modify if stale references remain: `README.md`

**Interfaces:**

- Consumes: Nx project `frontend` rooted at `apps/frontend`
- Produces: Nx project `link-sharing` rooted at `apps/link-sharing`, with the same Angular targets and behavior

- [ ] **Step 1: Record the baseline project identity and targets**

Run:

```bash
npm exec -- nx show project frontend --json
```

Expected: exit code 0; JSON contains `"name":"frontend"`, `"root":"apps/frontend"`, and the targets `lint`, `build`, `test`, `serve`, `typecheck`, and `serve-static`.

- [ ] **Step 2: Preview the Nx move**

Run:

```bash
npm exec -- nx g @nx/workspace:move apps/link-sharing --projectName=frontend --newProjectName=link-sharing --dry-run --no-interactive
```

Expected: exit code 0; dry-run reports deletion under `apps/frontend`, creation under `apps/link-sharing`, and updates to project configuration without writing files.

- [ ] **Step 3: Execute the Nx move**

Run:

```bash
npm exec -- nx g @nx/workspace:move apps/link-sharing --projectName=frontend --newProjectName=link-sharing --no-interactive
```

Expected: exit code 0; `apps/link-sharing` exists and `apps/frontend` no longer exists.

- [ ] **Step 4: Verify the resolved Nx project identity**

Run:

```bash
npm exec -- nx show projects --json
npm exec -- nx show project link-sharing --json
```

Expected: the project list contains `link-sharing` and not `frontend`; resolved JSON contains `"name":"link-sharing"`, `"root":"apps/link-sharing"`, and the original six targets.

- [ ] **Step 5: Check active files for stale references**

Run:

```bash
rg -n --hidden --glob '!node_modules/**' --glob '!dist/**' --glob '!.nx/**' --glob '!.angular/**' --glob '!docs/superpowers/specs/**' --glob '!docs/superpowers/plans/**' 'apps/frontend|frontend:(build|serve|test|lint|typecheck|serve-static)|nx serve frontend|[-,]p frontend' .
```

Expected: no matches. If `README.md` contains old commands, replace `nx serve frontend` with `nx serve link-sharing`, replace project selections containing `frontend` with `link-sharing`, and change the active app path from `apps/frontend` to `apps/link-sharing`. Repeat the search until it returns no matches.

- [ ] **Step 6: Format the generator changes**

Run:

```bash
npm exec -- nx format --fix
```

Expected: exit code 0.

- [ ] **Step 7: Run all quality targets on the renamed project**

Run:

```bash
npm exec -- nx run-many -t lint,test,typecheck,build -p link-sharing
```

Expected: exit code 0; Nx reports successful `lint`, `test`, `typecheck`, and `build` targets for `link-sharing`.

- [ ] **Step 8: Confirm the old project name is invalid**

Run:

```bash
npm exec -- nx show project frontend --json
```

Expected: non-zero exit code with an error that project `frontend` cannot be found.
