---
ecosystem_feature: ECO-0001
ecosystem_requirements:
  - REQ-ECO-001
  - REQ-ECO-005
  - REQ-ECO-006
  - REQ-ECO-008
project: red-web
local_feature: docs/features/0011-password-recovery
---

# Password Recovery Web Spec

## Problem

The web login page offers no self-service recovery. It must initiate the shared
recovery contract without leaking account state and must reliably constrain a
temporary-password session to the mandatory password-change workflow.

## Scope

Add an accessible recovery action/form to `/login`, integrate the public API,
model validation/loading/generic success/error/retry states, and align login,
session and protected-route behavior with the backend mandatory-change contract.

## Impact Classification

- Impact: high
- Creates new domain/workflow: yes
- Changes domain model: no
- Changes public API contract: yes
- Changes durable architecture/project memory: yes
- Impacted canonical docs:
  - `docs/specs/user.spec.md`
  - `docs/tasks/user.tasks.md`
  - `docs/memory/project.memory.md`

## Criticality

Critical: authentication, security, tenant identity and backend-contract sensitive.

## Requirements

- REQ-WEB-RECOVERY-001: `/login` exposes a keyboard- and screen-reader-accessible
  "Forgot password" action and recovery form requiring normalized `companyId`
  and email without requiring an authenticated session.
- REQ-WEB-RECOVERY-002: Client validation prevents malformed requests and the UI
  explicitly represents idle, submitting, generic accepted, failure and retry states.
- REQ-WEB-RECOVERY-003: Every `202` response shows generic copy that does not
  confirm account existence, status or email delivery; `429` and connectivity/
  server failures remain actionable without leaking account information.
- REQ-WEB-RECOVERY-004: The API wrapper and tests match the approved backend
  recovery method, route, body, statuses and error semantics.
- REQ-WEB-RECOVERY-005: Login preserves the backend mandatory-change flag; a user
  signed in with a temporary password is redirected to `/change-password`, cannot
  navigate to another private route, and password values are never logged/persisted.
- REQ-WEB-RECOVERY-006: Successful mandatory change updates/renews session data as
  defined by the backend, clears recovery state and enables ordinary navigation;
  expired/invalid sessions return safely to login.

## API/Data Contract

- `POST /users/password-recovery` with required `{ companyId, email }`.
- Valid syntax returns `202` plus
  `{ message: "password.recovery.request.accepted" }`; invalid syntax is `400`;
  throttling is generic `429` with optional `Retry-After`.
- `POST /users/login` sends required `{ companyId, email, password }`; its user
  projection includes the approved mandatory-change flag.
- The authenticated password-change route remains compatible with the existing
  `{ currentPassword, newPassword, confirmPassword }` body during rollout.
- Recovery calls carry no access token or client-authored authorization tenant header.

## UI States

- Loading: disable duplicate recovery submission and expose progress accessibly.
- Error: inline validation; generic actionable connectivity/server/throttle feedback.
- Empty: recovery form begins empty, with no account-derived content.
- Success: state that an email will be sent only if an eligible account matches;
  offer return to login and safe resubmission after throttling policy allows.

## Test Strategy

- Unit/component coverage: login recovery action, focus, validation, disabled state,
  `202`, `400`, `429`, connectivity retry and generic copy.
- Integration or route coverage: API wrapper payload; mandatory-change redirect,
  private-route guard, successful change and expired/invalid session behavior.
- Manual verification: keyboard, screen reader name/focus, narrow viewport, browser
  refresh and no credential values in console/storage.

## MCP Sources

- Backend/API contract: linked backend spec and local OpenAPI; no external MCP source used.
- Design/source of truth: current `LoginPage`, `AuthContext`, `PrivateRoute` and
  `ChangeInitialPassword` patterns.
- Issue/product request: `ECO-0001`, created 2026-09-03.

## Acceptance Criteria

- Recovery can be initiated and retried from `/login` without authentication.
- User-visible success does not reveal whether an account exists or email was sent.
- Temporary-password sessions cannot render ordinary private routes.
- Focused tests and all web gates pass with backend contract synchronization.

## Out Of Scope

- SMS/link reset, admin reset, account email changes and backend security enforcement.
