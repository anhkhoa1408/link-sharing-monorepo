# Direct API CORS Design

## Goal

The Angular development frontend calls the NestJS API directly at
`http://localhost:3333/api` instead of forwarding `/api` through the Angular
development server.

## Changes

- Set the frontend `baseApi` value to `http://localhost:3333/api`.
- Enable NestJS CORS only for the development frontend origin
  `http://localhost:4200`.
- Remove the Angular development-server proxy option and its proxy
  configuration file.

## Request Flow

The browser sends login and registration requests from
`http://localhost:4200` directly to `http://localhost:3333/api`. NestJS handles
the browser preflight request and returns the CORS headers that authorize the
frontend origin.

## Error Handling

Existing Angular HTTP error handling remains unchanged. Requests from origins
other than `http://localhost:4200` are not authorized by CORS.

## Verification

The repository does not permit adding application tests. Verify the change by
running the existing Nx lint, typecheck, and build targets, then exercising an
OPTIONS request against the login endpoint when the API is available.
