---
name: red-web-api-contract
description: Use when changing red-web API wrappers, React Query hooks, backend payload assumptions, OpenAPI/contract usage, filters, pagination, status/error handling, or frontend/backend compatibility.
---

# Red Web API Contract

## Use When
- A feature depends on backend routes, payloads, status codes, errors, filters, pagination, auth, tenant behavior, or OpenAPI.
- Code touches `src/shared/api`, `src/shared/hooks`, or shared API utilities.
- Frontend behavior changes because backend contract changed.

## Required Context
- active feature SDD files
- impacted API wrapper and hook
- related backend/OpenAPI contract docs when available
- `docs/contracts/README.md` and contract-check notes when relevant

## Workflow
1. Identify method, path, params, query, request body, response shape, errors, auth, role, tenant, cache, and pagination.
2. Prefer shared API modules over direct HTTP calls in components.
3. Keep React Query keys stable and specific enough to invalidate correctly.
4. Show backend validation/auth errors through the project error formatter when available.
5. Run `npm run contracts:check` when contract drift is possible.
6. Update feature and canonical docs when public contract assumptions change.

## Verification
- focused API/hook/component tests when available
- `npm run contracts:check` when backend contract can drift
- `npm run sdd:check`
- `npm run test`
- `npm run lint`
- `npm run build`

## Review Checks
- Request payloads match documented backend expectations.
- Query params and pagination are documented.
- Cache invalidation covers create/update/delete flows.
- API errors are not swallowed or rendered as raw objects.
