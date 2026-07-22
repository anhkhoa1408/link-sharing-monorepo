# Avatar Upload Design

## Scope

Add authenticated API endpoints for uploading and loading a user's avatar from a private Supabase Storage bucket. Frontend work, avatar deletion, image transformation, Prisma persistence, and Supabase Auth metadata changes are out of scope.

## Storage Model

- Configure the private bucket name through `SUPABASE_AVATARS_BUCKET`.
- Store one object per user at `<userId>/avatar`.
- Upload with `upsert: true`, so a new avatar replaces the previous object.
- Derive the object path from the authenticated JWT subject. Do not accept a user ID or object path from request input.
- Do not persist signed URLs. Generate a new signed URL with a one-hour lifetime whenever the API returns an avatar URL.
- The bucket must already exist and remain private. The application does not create or configure the bucket.

## Architecture

Create a cohesive avatar feature following the API's MVC dependency flow:

- `AvatarController` handles the authenticated HTTP endpoints, multipart input, and response DTOs.
- `AvatarService` coordinates avatar upload and signed URL generation.
- `AvatarRepository` owns all Supabase Storage calls and injects `SupabaseService`.
- `AvatarModule` wires and exports the feature providers required by the application.

No Prisma model or migration is needed because the storage path is deterministic.

## API

### Upload avatar

`POST /users/me/avatar`

- Requires a valid bearer token.
- Accepts `multipart/form-data` with one file field named `avatar`.
- Maximum file size: 5 MB.
- Accepted MIME types: `image/jpeg`, `image/png`, and `image/webp`.
- Uploads to `<userId>/avatar` with overwrite enabled.
- Returns HTTP 200 with:

```json
{
  "avatarUrl": "https://signed-private-url",
  "expiresAt": "2026-07-22T12:00:00.000Z"
}
```

### Load avatar

`GET /users/me/avatar`

- Requires a valid bearer token.
- Generates a fresh one-hour signed URL for `<userId>/avatar`.
- Returns the same response shape as the upload endpoint.
- Returns HTTP 404 when no avatar exists.

## Data Flow

1. `JwtAuthGuard` validates the bearer token and exposes the JWT subject.
2. Controller validates multipart presence, MIME type, and the 5 MB size limit.
3. Service derives `<userId>/avatar`; caller cannot select another user's path.
4. Repository uploads the object or creates a signed URL through `SupabaseService.storage`.
5. Service returns the signed URL and its calculated expiration timestamp.

## Error Handling

- Missing file, unsupported MIME type, or file larger than 5 MB: HTTP 400.
- Missing, invalid, or expired bearer token: HTTP 401.
- Missing avatar on the load endpoint: HTTP 404.
- Supabase Storage failure or unavailability: HTTP 503 with a stable application message; provider details are not exposed.

## Security

- All endpoints require `JwtAuthGuard`.
- Object ownership comes only from the verified JWT subject.
- Storage operations stay in the API and use the existing privileged Supabase client.
- The service-role key and bucket internals are never exposed to the browser.
- Signed URLs expire after one hour.

## Verification

Repository policy forbids adding tests under either application. Verify the implementation through Nx lint, typecheck, and build targets for `api` and `link-sharing`. Live upload verification additionally requires a configured private bucket and valid Supabase credentials.
