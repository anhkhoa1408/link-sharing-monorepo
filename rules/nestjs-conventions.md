# NestJS Conventions

## Architecture

- Follow NestJS best practices and organize the API into cohesive feature modules.
- Do not create or add tests of any kind for the NestJS API.
- Follow MVC with this dependency flow: `Controller -> Service -> Repository -> Database`.
- Controllers handle HTTP input/output only and must remain thin.
- Services coordinate business rules and use cases; they must not query Prisma directly.
- Repositories own all database access, queries, persistence, and Prisma calls.
- Models/entities represent domain data; DTOs define validated API contracts.
- Inject dependencies through Nest providers; do not construct infrastructure clients in features.
- Export public providers from modules instead of importing another feature's internals.
- Validate request data with DTOs and validate environment variables at startup.
- Use Nest exceptions and centralized filters/interceptors for consistent API errors.
- Keep transport, business, and persistence concerns separate.

## Folder Structure

- Keep feature-specific constants in `<feature>/constants/*.constants.ts`.
- Keep feature-specific errors in `<feature>/errors/*.errors.ts`.
- Keep feature-specific exception filters in `<feature>/filters/*.filter.ts`.
- Keep feature-specific interfaces and type aliases in `<feature>/types/*.types.ts`.
- Keep feature-specific validators in `<feature>/validators/*.validator.ts`.
- Move these files to an application-wide or shared location only when they have a genuine cross-feature consumer.
