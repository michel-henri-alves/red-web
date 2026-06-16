---
name: red-cross-project-contract-change
description: Use when a change crosses red-backend and red-web, including backend routes, OpenAPI, request/response payloads, frontend API wrappers, React Query hooks, screens, tests, or SDD docs.
---

# Red Cross Project Contract Change

## Use When
- A backend route, validation, DTO, status code, or response shape changes and `red-web` consumes it.
- A frontend feature needs a backend contract that is new, changed, or ambiguous.
- A feature has coordinated SDD folders in both `red-backend/docs/features` and `red-web/docs/features`.

## Required Context
- Backend feature SDD files and impacted route/controller/validation/DTO/service.
- Frontend feature SDD files and impacted API wrapper, hook, page, and tests.
- `red-backend/docs/contracts/openapi.json`.
- `red-backend/docs/sdd/skills.md` and `red-web/docs/sdd/skills.md` when selecting project-specific skills.

## Workflow
1. Identify the backend source of truth: method, path, auth, role, tenant source, params, query, body, response, status codes, and error body.
2. Confirm OpenAPI is generated or intentionally unchanged.
3. Map every consumed contract to the frontend API wrapper, React Query hook, query key, invalidation path, and UI state.
4. Keep backend authority for tenant, validation, and business rules; frontend mirrors contract behavior without inventing scope.
5. Update both projects' feature docs and canonical docs when the public behavior is high impact.
6. Run backend contract verification before frontend verification.

## Verification
- Backend: `npm run sdd:check`, focused tests, `npm run openapi:check`, `npm test`, `npm run lint`.
- Frontend: `npm run sdd:check`, `npm run contracts:check`, focused tests, `npm run test`, `npm run build`.

## Review Checks
- No frontend caller depends on an undocumented backend field.
- OpenAPI, backend tests, and frontend expectations agree.
- Tenant and auth behavior is enforced by backend and represented in UI states.
- Both feature task files record verification evidence before closure.
