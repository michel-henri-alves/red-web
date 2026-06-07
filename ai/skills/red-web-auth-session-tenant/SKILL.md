---
name: red-web-auth-session-tenant
description: Use when changing red-web login, auth context, token/session behavior, protected routes, role routes, tenant/company context, headers, or authorization-sensitive UI.
---

# Red Web Auth Session Tenant

## Use When
- Code touches `AuthContext`, `PrivateRoute`, `RoleRoute`, route config, login, password-change flows, auth session helpers, or axios auth headers.
- A feature changes role visibility, protected navigation, tenant/company context, or token/session behavior.

## Required Context
- active feature SDD files
- `src/context/AuthContext.jsx`
- `src/PrivateRoute.jsx`, `src/RoleRoute.jsx`, and `src/RouteConfig.jsx` when routing changes
- `src/shared/utils/authSession.js` and API client utilities when headers/session behavior changes
- relevant tests

## Workflow
1. Identify the auth boundary: login response, token storage, route guard, role check, tenant/company headers, and API client behavior.
2. Preserve backend authority for tenant enforcement; frontend must not invent tenant scope.
3. Keep protected routes behind the correct guard.
4. Avoid exposing tokens or sensitive user/company data in logs or UI.
5. Add focused tests for auth/session/role behavior when it changes.
6. Run `npm run test`, `npm run lint`, and `npm run build`.

## Review Checks
- Auth headers are preserved through shared API utilities.
- Role changes are explicit in SDD and route/menu code.
- Logout/session-expiration paths clear local session state.
- Password-change flows do not expose plaintext passwords.
