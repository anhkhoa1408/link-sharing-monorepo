# Rename Frontend Project to Link Sharing

## Goal

Rename the Angular application from `frontend` to `link-sharing` at both the Nx project and filesystem levels without changing application behavior.

## Scope

- Move `apps/frontend` to `apps/link-sharing`.
- Rename the Nx project from `frontend` to `link-sharing`.
- Update project target references, source paths, output paths, proxy configuration paths, and documentation commands that use the old name or location.
- Keep the API project and application functionality unchanged.

## Approach

Use the Nx `@nx/workspace:move` generator with `frontend` as the source project, `apps/link-sharing` as the destination, and `link-sharing` as the new project name. Run the generator in dry-run mode first, inspect its planned changes, then run it for real. Apply small follow-up edits only for references the generator does not update.

This approach is preferred over a manual directory move because the Nx generator updates project configuration and target references consistently.

## Verification

After the rename:

1. Confirm Nx lists `link-sharing` and no longer lists `frontend`.
2. Confirm the resolved project root is `apps/link-sharing` and its targets no longer reference `apps/frontend` or `frontend:*`.
3. Search active workspace files for stale `apps/frontend` and project-name references, excluding historical design and plan documents.
4. Run the `lint`, `test`, `typecheck`, and `build` targets for `link-sharing` through Nx.

## Non-goals

- No UI, routing, API, dependency, or deployment behavior changes.
- Historical design and implementation-plan documents remain unchanged because they describe the state and commands used at the time they were written.
