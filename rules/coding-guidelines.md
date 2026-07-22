# Coding Guidelines

## 1. Think Before Coding

**Do not guess. Do not hide ambiguity. State trade-offs clearly.**

Before implementing:

- State your assumptions. If uncertain, ask.
- If multiple interpretations are possible, present them instead of choosing silently.
- If a simpler approach exists, mention it. Push back when appropriate.
- If something is unclear, stop, identify the ambiguity, and ask for clarification.

## 2. Prefer Simplicity

**Write the minimum code needed to solve the requested problem. Do not speculate.**

- Do not add features beyond the request.
- Do not create abstractions for code used only once.
- Do not add flexibility or configuration unless requested.
- Do not handle scenarios that cannot occur.
- If 50 lines can replace 200 lines, rewrite it.

Ask: "Would a senior engineer consider this over-engineered?" If yes, simplify it.

## 3. Make Targeted Changes

**Touch only what is necessary. Clean up only what your change makes obsolete.**

When editing existing code:

- Do not improve unrelated code, comments, or formatting.
- Do not refactor code that is not part of the request.
- Preserve the existing style, even if you would choose a different approach.
- If you find unrelated dead code, mention it instead of deleting it.

When your change makes code obsolete:

- Remove imports, variables, and functions made unused by your change.
- Do not remove pre-existing dead code unless requested.

Verification criterion: every changed line must directly support the user's request.
