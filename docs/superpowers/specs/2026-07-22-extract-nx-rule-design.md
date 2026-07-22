# Extract Nx Rule Design

## Goal

Move the Nx-managed instructions out of `AGENTS.md` into a dedicated rule file while keeping the project-specific guidance in `AGENTS.md` unchanged.

## Design

- Create `rules/nx-rule.md`.
- Move the complete Nx block, including the `nx configuration start` and `nx configuration end` comments, into the new file without changing its content.
- Replace the removed block at the top of `AGENTS.md` with `@rules/nx-rule.md`.
- Preserve all Angular, NestJS, Prisma, Supabase, Redis, and command guidance in `AGENTS.md`.
- Do not create or modify `CLAUDE.md`.

## Verification

- Confirm the new file contains both Nx marker comments and all original Nx guidance.
- Confirm `AGENTS.md` begins with the rule reference and contains no duplicated Nx-managed block.
- Confirm the project-specific content in `AGENTS.md` remains unchanged.
