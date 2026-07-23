# Profile Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a functional `/profile` page that loads and saves the signed-in user's name and avatar while sharing the authenticated application shell with `/home`.

**Architecture:** Prisma stores one profile row per Supabase user, while the existing Supabase Storage avatar endpoints continue to own avatar files. A shared Angular `MainTemplateComponent` owns the authenticated shell and route-aware navigation; route pages supply editor content and preview values.

**Tech Stack:** Angular 22 standalone components, Angular Signal Forms, Angular `HttpClient`, NestJS 11, Prisma 7, Supabase Auth and Storage, SCSS/BEM, Nx/npm.

## Global Constraints

- Work directly on the existing `main` branch; do not create a worktree.
- Do not create any tests or test files under `apps/link-sharing` or `apps/api`.
- Run all validation, generation, lint, typecheck, and build tasks through Nx.
- Keep Supabase Auth as the source of account identity/email and Supabase Storage as the source of avatar files.
- Only repositories may use `PrismaService`.
- Preserve the existing avatar contract: JPEG, PNG, or WebP up to 5 MB; do not add pixel-dimension validation.
- Use standalone Angular APIs, Signal Forms, `ChangeDetectionStrategy.OnPush`, inline templates/styles, BEM, and existing design tokens.
- Do not add Tailwind or a new dependency.
- Preserve unrelated user changes already present in the worktree.

---

### Task 1: Add The Profile Domain Model And API

**Files:**
- Modify: `apps/api/prisma/schema.prisma`
- Create: `apps/api/prisma/migrations/20260723000000_add_profile/migration.sql`
- Create: `libs/shared-models/src/lib/profile.models.ts`
- Modify: `libs/shared-models/src/index.ts`
- Create: `apps/api/src/app/profile/dto/update-profile.dto.ts`
- Create: `apps/api/src/app/profile/dto/profile-response.dto.ts`
- Create: `apps/api/src/app/profile/types/profile.types.ts`
- Create: `apps/api/src/app/profile/profile.repository.ts`
- Create: `apps/api/src/app/profile/profile.service.ts`
- Create: `apps/api/src/app/profile/profile.controller.ts`
- Create: `apps/api/src/app/profile/profile.module.ts`
- Modify: `apps/api/src/app/app.module.ts`

**Interfaces:**
- Produces: `UpdateProfile { firstName: string; lastName: string }`
- Produces: `Profile extends UpdateProfile { id: string; userId: string; createdAt: string; updatedAt: string }`
- Produces: authenticated `GET /users/me/profile` and `PUT /users/me/profile`

- [ ] **Step 1: Add the Prisma model and SQL migration**

Add the following model:

```prisma
model Profile {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @unique @db.Uuid
  firstName String
  lastName  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Create SQL that creates the same columns and a unique index on `userId`.

- [ ] **Step 2: Add shared profile contracts**

```ts
export interface UpdateProfile {
  firstName: string;
  lastName: string;
}

export interface Profile extends UpdateProfile {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvatarResponse {
  avatarUrl: string;
  expiresAt: string;
}
```

Export these types from `libs/shared-models/src/index.ts`.

- [ ] **Step 3: Implement validation and persistence**

`UpdateProfileDto` implements `UpdateProfile` and uses `@IsString()`,
`@MinLength(1)`, `@MaxLength(80)`, and `@Transform(({ value }) =>
typeof value === 'string' ? value.trim() : value)` for both names.

The repository exposes:

```ts
upsert(userId: string, data: UpdateProfile): Promise<ProfileModel>
findByUserId(userId: string): Promise<ProfileModel | null>
```

The service throws `NotFoundException('Profile not found')` when no profile
exists and maps Prisma `Date` values to ISO strings. The controller derives
`userId` from `request.user.claims.sub`.

- [ ] **Step 4: Register and verify the module**

Import `ProfileModule` in `AppModule`, then run:

```bash
npm exec -- nx run api:prisma:validate
npm exec -- nx run api:prisma:generate
npm exec -- nx typecheck api
```

Expected: all commands exit `0` and generated Prisma exposes
`prisma.profile`.

- [ ] **Step 5: Commit the API slice**

```bash
git add apps/api/prisma apps/api/src/app/profile apps/api/src/app/app.module.ts libs/shared-models
git commit -m "feat(api): add user profiles"
```

### Task 2: Add Authenticated Frontend API Clients

**Files:**
- Modify: `apps/link-sharing/src/app/core/auth.service.ts`
- Create: `apps/link-sharing/src/app/core/interceptors/auth.interceptor.ts`
- Modify: `apps/link-sharing/src/app/app.config.ts`
- Modify: `apps/link-sharing/src/app/api/auth-api.service.ts`
- Create: `apps/link-sharing/src/app/api/profile-api.service.ts`
- Create: `apps/link-sharing/src/app/api/avatar-api.service.ts`

**Interfaces:**
- Consumes: `Profile`, `UpdateProfile`, `AvatarResponse`
- Produces: `AuthService.getAccessToken(): string | null`
- Produces: `AuthApiService.me(): Observable<User>`
- Produces: `ProfileApiService.get()/update()`
- Produces: `AvatarApiService.get()/upload()`

- [ ] **Step 1: Expose only valid access tokens**

Refactor `isAuthenticated()` to delegate to:

```ts
public getAccessToken(): string | null
```

The method reads storage safely, removes malformed/expired values, and returns
only a valid token.

- [ ] **Step 2: Attach bearer auth to API requests**

Create a functional interceptor that checks
`request.url.startsWith(environment.baseApi)`, obtains the valid token, and
clones the request with `Authorization: Bearer ${token}`. Register it using
`provideHttpClient(withInterceptors([authInterceptor]))`.

- [ ] **Step 3: Add focused API services**

```ts
public me(): Observable<User>
public get(): Observable<Profile>
public update(profile: UpdateProfile): Observable<Profile>
public get(): Observable<AvatarResponse>
public upload(file: File): Observable<AvatarResponse>
```

Avatar upload appends the file under the existing `avatar` form-data field and
does not set `Content-Type` manually.

- [ ] **Step 4: Verify frontend contracts**

```bash
npm exec -- nx typecheck link-sharing
npm exec -- nx lint link-sharing
```

Expected: both commands exit `0`.

- [ ] **Step 5: Commit the client data layer**

```bash
git add apps/link-sharing/src/app/api apps/link-sharing/src/app/core apps/link-sharing/src/app/app.config.ts
git commit -m "feat(link-sharing): add profile API clients"
```

### Task 3: Extract The Shared Main Template

**Files:**
- Create: `apps/link-sharing/src/app/templates/main-template/main-template.component.ts`
- Create: `apps/link-sharing/src/app/organisms/phone-preview/phone-preview.component.ts`
- Modify: `apps/link-sharing/src/app/molecules/tab-button/tab-button.component.ts`
- Modify: `apps/link-sharing/src/app/pages/home/home.component.ts`
- Delete: `apps/link-sharing/src/app/pages/home/_components/home-header.component.ts`
- Delete: `apps/link-sharing/src/app/pages/home/_components/phone-preview.component.ts`

**Interfaces:**
- Produces: `MainTemplateComponent` inputs `firstName`, `lastName`, `email`,
  and `avatarUrl`
- Produces: `PhonePreviewComponent` with the same profile inputs
- Produces: `TabButtonComponent.route: InputSignal<string>`
- Consumes: route page content and `[main-template-actions]` projected content

- [ ] **Step 1: Make navigation route-aware**

Change `TabButtonComponent` to render a `RouterLink` anchor with `route`,
`label`, and `icon` inputs. Use `RouterLinkActive` to apply
`tab-button--active` and set `aria-current="page"`.

- [ ] **Step 2: Promote and parameterize phone preview**

Move the phone preview to `organisms/phone-preview`. Add nullable string inputs
for names, email, and avatar. Render the avatar and text when supplied; retain
the Figma skeleton placeholders when values are empty. Keep the existing fixed
link preview.

- [ ] **Step 3: Create the shared shell**

`MainTemplateComponent` renders the Devlinks header, Links/Profile router
navigation, Logout/Preview actions, responsive preview panel, editor panel,
main `<ng-content>`, and an action-slot `<ng-content
select="[main-template-actions]">`.

- [ ] **Step 4: Refactor Home to compose the template**

Replace Home's duplicated page shell with:

```html
<app-main-template>
  <!-- existing Customize your links content -->
  <div main-template-actions>
    <app-button>Save</app-button>
  </div>
</app-main-template>
```

Preserve existing example link state and editor components.

- [ ] **Step 5: Verify both desktop and responsive compilation**

```bash
npm exec -- nx typecheck link-sharing
npm exec -- nx lint link-sharing
npm exec -- nx build link-sharing
```

Expected: all commands exit `0`; component styles remain below configured
budgets.

- [ ] **Step 6: Commit the shared shell**

```bash
git add apps/link-sharing/src/app/templates apps/link-sharing/src/app/organisms/phone-preview apps/link-sharing/src/app/molecules/tab-button apps/link-sharing/src/app/pages/home
git commit -m "refactor(link-sharing): share main application shell"
```

### Task 4: Build The Functional Profile Page

**Files:**
- Create: `apps/link-sharing/src/app/pages/profile/profile.component.ts`
- Modify: `apps/link-sharing/src/app/app.routes.ts`
- Modify: `apps/link-sharing/src/app/atoms/input/input.component.ts`
- Modify: `apps/link-sharing/src/app/atoms/image-upload/image-upload.component.ts`

**Interfaces:**
- Consumes: `MainTemplateComponent`, profile/auth/avatar API services
- Produces: lazy authenticated `/profile` route
- Produces: live preview signals and save status

- [ ] **Step 1: Support disabled/read-only fields and avatar validation**

Add a `disabled` input to `InputComponent` and bind it to the native input.
Add a 5 MB size check to `ImageUploadComponent`; emit a user-facing error when
the file exceeds the existing API limit while preserving JPEG/PNG/WebP accept
types.

- [ ] **Step 2: Create the Signal Form**

Use:

```ts
private readonly model = signal<UpdateProfile>({
  firstName: '',
  lastName: '',
});

public readonly profileForm = form(this.model, (path) => {
  required(path.firstName, { message: 'First name is required' });
  required(path.lastName, { message: 'Last name is required' });
});
```

Keep email, current avatar URL, selected avatar file, load/save state, and
accessible status copy in focused signals/computed signals.

- [ ] **Step 3: Load initial data**

Load profile, current user, and avatar concurrently. Treat profile/avatar `404`
as empty state. Surface authentication/infrastructure errors without clearing
the form. Populate the Signal Form model and preview values from successful
responses.

- [ ] **Step 4: Implement Save**

Use Signal Forms `submit()` to validate, then update the profile. Upload the
selected avatar only after the profile succeeds. On avatar failure retain the
file and show the partial-failure message. On success update the signed URL,
clear the selected file, and announce success.

- [ ] **Step 5: Match Figma and responsive behavior**

Implement the Profile Details heading, upload row, personal information
section, bottom Save action, desktop dimensions, hidden preview breakpoint,
mobile stacked labels, focus states, loading state, and accessible live status
using existing tokens and BEM SCSS.

- [ ] **Step 6: Add the guarded route and verify**

Add lazy-loaded `/profile` with `canActivate: [authGuard]`, then run:

```bash
npm exec -- nx typecheck link-sharing
npm exec -- nx lint link-sharing
npm exec -- nx build link-sharing
```

Expected: all commands exit `0`.

- [ ] **Step 7: Commit the profile UI**

```bash
git add apps/link-sharing/src/app/pages/profile apps/link-sharing/src/app/app.routes.ts apps/link-sharing/src/app/atoms
git commit -m "feat(link-sharing): implement profile page"
```

### Task 5: Full Verification And Visual QA

**Files:**
- Modify only files required by failures found in this task.

**Interfaces:**
- Consumes: complete profile feature
- Produces: verified API and frontend build

- [ ] **Step 1: Run repository verification**

```bash
npm exec -- nx run api:prisma:validate
npm exec -- nx run api:prisma:generate
npm exec -- nx run-many -t lint,typecheck,build -p link-sharing,api
git diff --check
```

Expected: all commands exit `0`; no whitespace errors.

- [ ] **Step 2: Run local visual QA**

Serve the applications through Nx, open `/home` and `/profile`, and inspect at
desktop and mobile widths. Compare `/profile` to Figma node `22149:1655`.
Confirm navigation, disabled email, live name/avatar preview, save progress,
success, API errors, partial avatar errors, keyboard focus, and absence of
horizontal overflow.

- [ ] **Step 3: Review scope and worktree**

Use `git diff --stat`, `git diff --check`, and `git status --short`. Confirm
every changed line supports the approved spec and that unrelated pre-existing
changes remain intact.

- [ ] **Step 4: Commit verification fixes, if any**

Stage each verification-fix path explicitly after inspecting `git status`;
do not stage unrelated pre-existing worktree changes.

```bash
git commit -m "fix(link-sharing): finalize profile page"
```
