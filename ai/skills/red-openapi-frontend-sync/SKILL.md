---
name: red-openapi-frontend-sync
description: Use when backend OpenAPI output, frontend contract checks, API wrappers, generated contract artifacts, endpoint paths, schemas, filters, or pagination semantics must stay synchronized.
---

# Red OpenAPI Frontend Sync

## Use When
- `red-backend/docs/contracts/openapi.json` changes or should change.
- `red-web` API wrappers, hooks, filters, pagination, or endpoint assumptions change.
- `npm run contracts:check` or `npm run openapi:check` fails.

## Required Context
- Backend route/controller/validation/DTO and OpenAPI generator changes.
- `red-backend/docs/contracts/openapi.json`.
- Frontend API wrapper and hook using the endpoint.
- `red-web/scripts/check-backend-contract.js`.

## Workflow
1. Generate or check backend OpenAPI before changing frontend assumptions.
2. Compare path, method, auth, request body, query params, response schema, and error schema.
3. Update frontend API wrappers at the shared API layer, not directly in pages.
4. Align React Query keys and invalidation with new params or response identity.
5. Update docs and feature tasks with contract evidence.
6. Avoid weakening contract checks to pass a broken implementation.

## Verification
- Backend: `npm run openapi:check`.
- Frontend: `npm run contracts:check`.
- Focused tests around changed API/hook behavior.
- Full project verification when public contract changed.

## Review Checks
- Contract drift is fixed at the source, not hidden by local frontend workarounds.
- Removed fields are not still consumed by UI.
- New required request fields are validated in forms before submit when appropriate.
- Pagination and filters match backend semantics.
