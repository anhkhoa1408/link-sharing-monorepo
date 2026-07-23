# Angular Conventions

## Components and State

- Follow the current Angular best practices and use standalone APIs.
- Name component classes, selectors, and files according to the official Angular Style Guide.
- Keep the application zoneless; do not introduce Zone.js-dependent patterns.
- Prefer Signals for local, shared, and derived UI state.
- Use `signal` for mutable state and `computed` for derived state; reserve `effect` for synchronizing with non-reactive APIs.
- Prefer `ChangeDetectionStrategy.OnPush`; components that use the default strategy must remain zoneless-compatible and notify Angular through signals, template listeners, `AsyncPipe`, or `ChangeDetectorRef.markForCheck()`.
- Prefer `input()`, `model()`, `output()`, and signal queries over decorator-based APIs.
- Give each component one focused presentation or interaction responsibility; move business logic to services or standalone functions.

## TypeScript Members

- Give every property and method an explicit type when TypeScript cannot infer it reliably.
- Declare an access modifier on every property, including `public` properties.
- Declare an access modifier and an explicit return type on every method, including `public` methods.
- For an optional signal input with no domain default, declare a nullable type and initialize it to `null`, for example `public readonly user = input<User | null>(null)`; do not rely on implicit `undefined`.

## Templates and Data Access

- Keep template expressions straightforward and presentation-focused; move business logic and complex derivations to the component or a service.
- Use inline component templates with the `template` property. The root bootstrap component may use an external template when it serves only as the application shell.
- Use inline SCSS in the component `styles` property for component-specific styles; follow `scss-conventions.md` when styles require global reach. The root bootstrap component may use an external stylesheet for shell-level styles.
- Use Angular's `httpResource` for signal-driven, reactive `GET` state. Use `HttpClient` for mutations and imperative requests that do not benefit from resource state.
- Use lazy-loaded routes for feature areas and functional guards/interceptors.
- Use Angular Signal Forms from `@angular/forms/signals` for all forms.
- Use the built-in control flow syntax (`@if`, `@for`, `@switch`).
- Provide stable tracking expressions in `@for` blocks.
- Use `NgOptimizedImage` for static images, provide explicit dimensions, and set `priority` on above-the-fold hero images.
- Keep templates accessible: semantic HTML, labels, keyboard support, and visible focus.
- Do not expose backend secrets or privileged Supabase clients to browser code.

## Atomic Design

- Organize frontend UI components according to Atomic Design.
- `atoms` contain the smallest reusable UI primitives. They perform one visual or interaction responsibility and do not compose application-specific sections.
- `molecules` combine atoms into a small reusable control or interaction with one focused purpose.
- `organisms` combine atoms and molecules into a distinct, reusable section of a page or feature.
- `templates` define reusable page layouts and application shells. They arrange organisms and content slots without owning route-specific data or business logic.
- `pages` are route-level components. They compose templates and lower-level components, connect route and application data, and coordinate page-level interactions.
- Reserve `templates` for reusable application shell and page-layout components only.
- Do not extract page-only sections into separate components solely to satisfy an Atomic Design category; keep them in the page until they have a real reusable responsibility.
- Classify each component by its level of composition and responsibility before choosing its directory.
