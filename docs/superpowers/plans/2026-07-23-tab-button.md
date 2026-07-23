# Tab Button Molecule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable Angular `TabButtonComponent` molecule matching Figma node `22152:87`, with controlled active state and parent-owned activation handling.

**Architecture:** One standalone, OnPush component owns a native button, typed SVG map, and state styling. Consumers provide required label/icon inputs, control `active`, and handle `pressed`; Router integration and placement remain outside the molecule.

**Tech Stack:** Angular 22 signal APIs, TypeScript, inline SCSS, Nx 23

## Global Constraints

- Create only `apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts`.
- Use selector `app-tab-button`, standalone APIs, `ChangeDetectionStrategy.OnPush`, inline template, and inline SCSS.
- Public API: `label`, `icon`, `active`, `pressed`; parent owns active state.
- `TabButtonIcon` is exactly `'link' | 'profile'`; icon definitions stay local and typed.
- Use native `<button type="button">` with `aria-pressed`; no Angular Material, Router, `role="tab"`, or custom keyboard handlers.
- Match Figma: 16px/24px padding, 8px gap/radius, 20px icon, 16px semibold text at 150%, grey-500 default, purple-600 hover/active, purple-100 active background.
- No dependencies, Tailwind, Figma runtime assets, disabled/loading/error APIs, or placement elsewhere.
- `AGENTS.md` prohibits tests under `apps/link-sharing`; verify through Nx lint/typecheck/build, diff checks, and manual review.
- Preserve unrelated worktree changes.

---

### Task 1: Generate and implement `TabButtonComponent`

**Files:**
- Create: `apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts`

**Interfaces:**
- Consumes: Existing CSS custom properties; Angular `input`, `output`, and `computed`.
- Produces: `TabButtonIcon`; `TabButtonComponent` inputs `label`, `icon`, `active`; output `pressed`.

- [ ] **Step 1: Dry-run generator**

Run:

```bash
npm exec -- nx generate @nx/angular:component apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts --inline-template --inline-style --style=scss --change-detection=OnPush --skip-tests --no-interactive --dry-run
```

Expected: exactly one `CREATE` for the target `.ts`; no changes made.

- [ ] **Step 2: Generate shell**

Run the same command without `--dry-run`. Expected: one `.ts`; no test,
template, or style companion file.

- [ ] **Step 3: Replace shell with complete molecule**

```ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export type TabButtonIcon = 'link' | 'profile';

interface TabButtonIconDefinition {
  readonly path: string;
  readonly viewBox: string;
}

const TAB_BUTTON_ICONS = {
  link: {
    viewBox: '0 0 256 256',
    path: 'M117.18,188.74a12,12,0,0,1,0,17l-5.12,5.12A58.26,58.26,0,0,1,70.6,228h0A58.62,58.62,0,0,1,29.14,127.92L63.89,93.17a58.64,58.64,0,0,1,98.56,28.11,12,12,0,1,1-23.37,5.44,34.65,34.65,0,0,0-58.22-16.58L46.11,144.89A34.62,34.62,0,0,0,70.57,204h0a34.41,34.41,0,0,0,24.49-10.14l5.11-5.12A12,12,0,0,1,117.18,188.74ZM226.83,45.17a58.65,58.65,0,0,0-82.93,0l-5.11,5.11a12,12,0,0,0,17,17l5.12-5.12a34.63,34.63,0,1,1,49,49L175.1,145.86A34.39,34.39,0,0,1,150.61,156h0a34.63,34.63,0,0,1-33.69-26.72,12,12,0,0,0-23.38,5.44A58.64,58.64,0,0,0,150.56,180h.05a58.28,58.28,0,0,0,41.47-17.17l34.75-34.75a58.62,58.62,0,0,0,0-82.91Z',
  },
  profile: {
    viewBox: '0 0 256 256',
    path: 'M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20ZM79.57,196.57a60,60,0,0,1,96.86,0,83.72,83.72,0,0,1-96.86,0ZM100,120a28,28,0,1,1,28,28A28,28,0,0,1,100,120ZM194,179.94a83.48,83.48,0,0,0-29-23.42,52,52,0,1,0-74,0,83.48,83.48,0,0,0-29,23.42,84,84,0,1,1,131.9,0Z',
  },
} satisfies Record<TabButtonIcon, TabButtonIconDefinition>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tab-button',
  template: `
    <button
      class="tab-button"
      type="button"
      [attr.aria-pressed]="active()"
      [class.tab-button--active]="active()"
      (click)="pressed.emit()"
    >
      <svg
        aria-hidden="true"
        class="tab-button__icon"
        [attr.viewBox]="iconDefinition().viewBox"
      >
        <path [attr.d]="iconDefinition().path" fill="currentColor" />
      </svg>
      <span class="tab-button__label">{{ label() }}</span>
    </button>
  `,
  styles: `
    .tab-button {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-100);
      padding: var(--spacing-200) var(--spacing-300);
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--color-grey-500);
      cursor: pointer;
      font-family: 'Instrument Sans', sans-serif;
      font-size: var(--font-size-16);
      font-weight: var(--font-weight-semibold);
      line-height: var(--line-height-150);
      letter-spacing: 0;
      white-space: nowrap;

      &:hover,
      &--active {
        color: var(--color-purple-600);
      }

      &--active {
        background: var(--color-purple-100);
      }

      &:focus-visible {
        outline: 2px solid var(--color-purple-600);
        outline-offset: 2px;
      }

      &__icon {
        width: 20px;
        height: 20px;
        flex: 0 0 20px;
      }
    }
  `,
})
export class TabButtonComponent {
  public readonly label = input.required<string>();
  public readonly icon = input.required<TabButtonIcon>();
  public readonly active = input(false);
  public readonly pressed = output<void>();

  protected readonly iconDefinition = computed<TabButtonIconDefinition>(
    () => TAB_BUTTON_ICONS[this.icon()],
  );
}
```

- [ ] **Step 4: Format**

Run:

```bash
npm exec -- nx format:write --files=apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts
```

Expected: exit `0`; changes limited to new file.

- [ ] **Step 5: Verify frontend**

Run:

```bash
npm exec -- nx run-many -t lint,typecheck,build -p link-sharing
```

Expected: all three targets exit `0`.

- [ ] **Step 6: Inspect scoped diff**

Run both commands:

```bash
git diff --check -- apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts
git diff -- apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts
```

Expected: check prints nothing; diff contains only Step 3 component.

- [ ] **Step 7: Manual check**

When a host exists, confirm default, hover, active, focus-visible, pointer,
Enter, Space, and one `pressed` emission per activation. If no host consumes
the molecule, record rendering as deferred; do not add host wiring.

- [ ] **Step 8: Commit**

```bash
git add apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts
git commit -m "feat(link-sharing): add tab button molecule"
```

Expected: commit contains only new component.
