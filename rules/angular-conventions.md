# Angular Conventions

## Components and State

- Follow the current Angular best practices and use standalone APIs.
- Name component classes, selectors, and files according to the official Angular Style Guide.
- Keep the application zoneless; do not introduce Zone.js-dependent patterns.
- Prefer Signals for local, shared, and derived UI state.
- Use `signal`, `computed`, and `effect` deliberately; avoid effects for state derivation.
- Set `ChangeDetectionStrategy.OnPush` on components to reduce unnecessary checks.
- Prefer `input()`, `output()`, and signal queries over decorator-based APIs.
- Keep components focused on presentation and interaction; move business logic to services.
- Give each component one clear responsibility and keep it focused on doing that responsibility well.

## TypeScript Members

- Give every property and method an explicit type when TypeScript cannot infer it reliably.
- Declare an access modifier on every property, including `public` properties.
- Declare an access modifier and an explicit return type on every method, including `public` methods.
- For an optional signal input with no domain default, declare a nullable type and initialize it to `null`, for example `public readonly user = input<User | null>(null)`; do not rely on implicit `undefined`.

## Templates and Data Access

- Do not perform business logic or data calculations in templates; compute or derive values in the component class or a service and expose presentation-ready state to the template.
- Use inline component templates with the `template` property; do not create separate component `.html` template files.
- Use inline SCSS in the component `styles` property for page and component-specific styles.
- Keep reusable button and input atom styles in `apps/link-sharing/src/assets/scss/_button.scss` and `apps/link-sharing/src/assets/scss/_input.scss`; do not create component-local `.scss` files for them.
- Use Angular's `httpResource` API for reactive API reads and data fetching; use `HttpClient` directly for mutations such as `POST`, `PUT`, `PATCH`, and `DELETE`.
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
- Place route-level components in `pages/<feature>/<feature>.component.ts`.
- Reserve `templates` for reusable application shell and page-layout components only.
- Do not extract page-only sections into separate components solely to satisfy an Atomic Design category; keep them in the page until they have a real reusable responsibility.
- Place reusable UI components in the appropriate directory under `apps/link-sharing/src/app`: `atoms`, `molecules`, `organisms`, or `templates`.
- Classify each component by its level of composition and responsibility before choosing its directory.
