# Angular Material SCSS Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install Angular Material 22 for `link-sharing` and provide one global SCSS entry point for supported system-token and component-token overrides.

**Architecture:** The official Angular Material `ng-add` schematic installs and configures the workspace without changing templates. A focused `_material-theme.scss` file emits the Material 3 theme and maps its top-level colors and typography to the application's existing design tokens; future component overrides stay beside that theme and use public `mat.<component>-overrides` mixins.

**Tech Stack:** Angular 22.0.6, Angular Material 22.0.5, Angular CDK 22.0.5, Sass, Nx 23.1.0, npm

## Global Constraints

- Target only the `link-sharing` application.
- Do not import an Angular Material prebuilt theme.
- Do not add or redesign application UI components.
- Do not target Angular Material private DOM classes.
- Keep existing color and typography tokens as the application source of truth.
- Run all build, lint, test, typecheck, formatting, and generation tasks through the npm-prefixed Nx CLI where Nx provides the operation.

---

### Task 1: Install and run the official Angular Material schematic

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Possibly modify: `apps/link-sharing/src/app/app.config.ts`
- Possibly modify: `apps/link-sharing/src/styles.scss`

**Interfaces:**
- Consumes: Angular application project named `link-sharing` and npm lockfile.
- Produces: `@angular/material` and `@angular/cdk` dependencies at version `22.0.5`, plus only the official project-level setup emitted by the schematic.

- [ ] **Step 1: Install the matching Material packages**

Run:

```bash
npm install @angular/material@22.0.5 @angular/cdk@22.0.5
```

Expected: npm exits successfully and records both packages in `package.json` and `package-lock.json`.

- [ ] **Step 2: Discover the installed generator and its supported options**

Run:

```bash
npm exec nx list @angular/material
npm exec nx generate @angular/material:ng-add -- --help
```

Expected: `ng-add` is listed and help includes `project` and `theme` options.

- [ ] **Step 3: Read the generator implementation before running it**

Run:

```bash
sed -n '1,220p' node_modules/@angular/material/schematics/collection.json
sed -n '1,220p' node_modules/@angular/material/schematics/ng-add/schema.json
sed -n '1,280p' node_modules/@angular/material/schematics/ng-add/index.js
sed -n '1,320p' node_modules/@angular/material/schematics/ng-add/setup-project.js
sed -n '1,320p' node_modules/@angular/material/schematics/ng-add/theming/theming.js
sed -n '1,320p' node_modules/@angular/material/schematics/ng-add/theming/create-theme.js
```

Expected: the collection maps `ng-add` to the inspected files; the implementation's write scope agrees with the files listed above.

- [ ] **Step 4: Dry-run the custom-theme schematic**

Run:

```bash
npm exec nx generate @angular/material:ng-add -- --project=link-sharing --theme=custom --dry-run --no-interactive
```

Expected: Nx reports dependency/project styling changes without modifying application templates or registering a prebuilt theme.

- [ ] **Step 5: Apply the schematic**

Run:

```bash
npm exec nx generate @angular/material:ng-add -- --project=link-sharing --theme=custom --no-interactive
```

Expected: the schematic completes successfully and does not modify files outside dependency metadata, global styles, application bootstrap configuration, or the document shell.

- [ ] **Step 6: Review the generated delta**

Run:

```bash
git diff -- package.json package-lock.json apps/link-sharing/src/app/app.config.ts apps/link-sharing/src/styles.scss apps/link-sharing/src/index.html
```

Expected: no template component is changed and no path under `@angular/material/prebuilt-themes` appears. If Git remains unavailable, inspect those five files directly and compare them with the pre-task contents.

### Task 2: Add the SCSS theme and override boundary

**Files:**
- Create: `apps/link-sharing/src/assets/scss/_material-theme.scss`
- Modify: `apps/link-sharing/src/styles.scss`

**Interfaces:**
- Consumes: CSS custom properties emitted by `assets/_token/_color.scss` and the `Instrument Sans` font declared by `assets/_token/_typography.scss`.
- Produces: global Angular Material design-token declarations under `html`, with a stable location for future `mat.<component>-overrides` mixins.

- [ ] **Step 1: Create the global Material theme file**

Create `apps/link-sharing/src/assets/scss/_material-theme.scss` with:

```scss
@use '@angular/material' as mat;

html {
  color-scheme: light;

  @include mat.theme(
    (
      color: (
        primary: mat.$blue-palette,
        tertiary: mat.$violet-palette,
        theme-type: light,
      ),
      typography: (
        plain-family: 'Instrument Sans',
        brand-family: 'Instrument Sans',
        bold-weight: 700,
        medium-weight: 600,
        regular-weight: 400,
      ),
      density: 0,
    ),
    $overrides: (
      primary: var(--color-blue-500),
      on-primary: var(--color-white),
      error: var(--color-red-500),
      on-error: var(--color-white),
    )
  );
}
```

Expected: the file uses only Angular Material's public Sass API and existing application tokens for explicit brand overrides.

- [ ] **Step 2: Register the theme after foundational tokens**

Set `apps/link-sharing/src/styles.scss` to:

```scss
@use './assets/_token/color';
@use './assets/_token/typography';
@use './assets/scss/material-theme';
@use './assets/scss/index';
```

Expected: token declarations load before the Material theme, and general application utilities remain last.

- [ ] **Step 3: Compile the development build**

Run:

```bash
npm exec nx run link-sharing:build:development
```

Expected: build succeeds with no Sass error for `mat.theme`, palette names, typography keys, or override-token names.

- [ ] **Step 4: Demonstrate the future component override shape without shipping speculative styles**

Run:

```bash
rg -n "@mixin .*overrides" node_modules/@angular/material/button node_modules/@angular/material/form-field node_modules/@angular/material/input
```

Expected: installed source exposes public component override mixins such as `mat.button-overrides`; no unused override is added until a concrete component design requires it.

### Task 3: Format and verify the integration

**Files:**
- Verify: `package.json`
- Verify: `package-lock.json`
- Verify: `apps/link-sharing/src/assets/scss/_material-theme.scss`
- Verify: `apps/link-sharing/src/styles.scss`
- Verify: any schematic-approved bootstrap or document-shell change

**Interfaces:**
- Consumes: completed dependency and SCSS integration from Tasks 1 and 2.
- Produces: a formatted, buildable, lint-clean, type-safe, and test-passing `link-sharing` application.

- [ ] **Step 1: Format changed workspace files**

Run:

```bash
npm exec nx format:write -- --files=package.json,apps/link-sharing/src/styles.scss,apps/link-sharing/src/assets/scss/_material-theme.scss,apps/link-sharing/src/app/app.config.ts,apps/link-sharing/src/index.html
```

Expected: Nx exits successfully and formats only relevant files that exist.

- [ ] **Step 2: Run the app verification targets**

Run:

```bash
npm exec nx run-many -- --targets=build,lint,test,typecheck --projects=link-sharing
```

Expected: all four targets succeed. Existing unrelated failures must be reported separately with their full target and error.

- [ ] **Step 3: Confirm the dependency and theme invariants**

Run:

```bash
npm ls @angular/material @angular/cdk
rg -n "prebuilt-themes|@angular/material" package.json apps/link-sharing/src apps/link-sharing/project.json
```

Expected: Material and CDK resolve to `22.0.5`, `_material-theme.scss` is the only global Material styling entry point, and no prebuilt theme is referenced.

- [ ] **Step 4: Record completion**

If Git is available, run:

```bash
git add package.json package-lock.json apps/link-sharing/src/styles.scss apps/link-sharing/src/assets/scss/_material-theme.scss apps/link-sharing/src/app/app.config.ts apps/link-sharing/src/index.html
git commit -m "feat: add Angular Material theming"
```

Expected: one focused commit containing only Angular Material installation and theme integration. If Git remains unavailable, skip the commit and report that limitation without changing the completed workspace files.
