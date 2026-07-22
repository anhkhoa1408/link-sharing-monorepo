# Shared Coding Rules Design

## Goal

Add reusable coding-behavior guidance and an Angular static-image rule while keeping `AGENTS.md` concise and explicit about imported rules.

## Design

- Create `rules/coding-guidelines.md` in English.
- Include only the supplied sections 1–3: Think Before Coding, Prefer Simplicity, and Make Targeted Changes.
- Preserve the intent and checklist detail of the supplied Vietnamese source without adding sections 4, 5, or Lighthouse guidance.
- Organize the beginning of `AGENTS.md` as:

```md
# Shared Rules

## Nx Conventions

@rules/nx-rule.md

## Coding Guidelines

@rules/coding-guidelines.md

# Link Sharing Project
```

- Keep `rules/nx-rule.md` unchanged.
- Add an Angular convention requiring `NgOptimizedImage` for static images, explicit image dimensions, and `priority` for above-the-fold hero images.
- Replace the existing typed reactive forms convention with a rule requiring Angular Signal Forms from `@angular/forms/signals` for all forms.
- Preserve all other project-specific guidance in `AGENTS.md`.

## Verification

- Confirm both rule references appear under their named sections.
- Confirm the coding rule contains exactly three top-level numbered sections.
- Confirm the Angular rule uses the correct API name: `NgOptimizedImage`.
- Confirm the Angular guidance requires Signal Forms and no longer recommends typed reactive forms.
- Confirm the existing Nx rule and unrelated `AGENTS.md` content remain unchanged.
