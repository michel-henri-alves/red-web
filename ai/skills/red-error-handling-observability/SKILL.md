---
name: red-error-handling-observability
description: Use when changing red-web API error formatting, toast/error UI, failed async states, logging, diagnostics, or frontend handling of backend validation/auth/server errors.
---

# Red Error Handling Observability

## Use When
- Code touches `apiErrorFormatter`, API wrappers, React Query error handling, form validation display, toasts, or failed async UI.
- Backend error payloads or status codes change.
- A bug report lacks enough UI or diagnostic information to identify the failed operation.

## Required Context
- Changed API wrapper, hook, component, and nearby tests.
- `src/shared/utils/apiErrorFormatter.js`.
- Backend contract or OpenAPI when error payloads are backend-defined.
- Active feature SDD files for user-facing error expectations.

## Workflow
1. Identify expected error sources: validation, auth/session, tenant, not found, conflict, server error, network error, and timeout.
2. Convert backend errors through the shared formatter before rendering them.
3. Keep user-facing errors actionable without exposing tokens, passwords, stack traces, or sensitive tenant data.
4. Preserve accessible error text for forms and async regions.
5. Add tests for at least one failure path when behavior changes.
6. Update contract docs if public error semantics change.

## Verification
- Focused failure-path tests.
- `npm run sdd:check`
- `npm run contracts:check` when backend error contracts are involved
- `npm run test`
- `npm run build`

## Review Checks
- Raw error objects are not rendered.
- Session/auth errors route the user through the expected recovery path.
- Validation errors are tied to fields when possible.
- Diagnostic logs do not include secrets or customer-sensitive data.
