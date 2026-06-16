# Evolution Spec: Backend Modularization And Serverless Domain Lambdas

## Status

Planned.

## Problem

The current backend behaves like a monolith deployed to Lambda. This keeps
deployment simple, but over time it can make domain boundaries, runtime
ownership, contract generation, environment configuration, and production
debugging harder. The desired evolution is to prepare the backend for domain
separation and eventually run selected domains as independent serverless
functions.

## Goal

Move toward a modular backend architecture where each business domain can be
tested, deployed, observed, and eventually extracted independently without
breaking the frontend contract, tenant isolation, auth behavior, or production
deployment flow.

## Recommended Direction

Do not split the backend into many Lambdas in one step. First, make the backend a
modular monolith with clean domain boundaries. Then extract low-risk domains to
separate Lambdas only when there is a practical reason to do so.

## Target Domains

- `users-auth`: login, users, initial password, permissions, session behavior.
- `customers`: PF/PJ customers, contacts, validation, customer search.
- `sales`: sales creation, updates, totals, discounts, checkout preparation.
- `issues`: issue records and issue workflow.
- `dashboard`: read models, aggregations, cached summaries.
- `notifications`: email and future async side effects.
- `database-admin`: migrations and operational database jobs outside the HTTP
  runtime.

## Architecture Principles

- Backend remains the authority for business rules, validation, tenant
  enforcement, and persisted data semantics.
- Frontend contract validation must remain strict and automated.
- Shared runtime behavior must not be copied manually across Lambdas.
- Extract only domains with clear boundaries and measurable benefit.
- Prefer async events for side effects that do not need to block the HTTP
  response.
- Keep production deploy and rollback simple for each phase.

## Proposed End State

```text
red-web
  |
  v
API Gateway / HTTP API
  |
  +-- lambda-users-auth
  +-- lambda-customers
  +-- lambda-sales
  +-- lambda-issues
  +-- lambda-dashboard
  +-- lambda-notifications
          ^
          |
      EventBridge / SQS
```

Shared backend code should live in a deliberate shared package or shared module
area, for example:

```text
shared-backend/
  auth/
  tenant/
  errors/
  mongo/
  validation/
  openapi/
  brasiliaDate/
```

## Contract Strategy

The frontend should keep consuming a stable API contract. If the backend becomes
multi-Lambda, contracts should be generated per domain and also bundled into a
single frontend-facing OpenAPI document.

```text
docs/contracts/
  openapi-users.json
  openapi-customers.json
  openapi-sales.json
  openapi-issues.json
  openapi-dashboard.json
  openapi-bundle.json
```

## Migration Strategy

1. Modularize the monolith internally without changing runtime behavior.
2. Standardize shared backend runtime concerns.
3. Generate and validate domain-level contracts.
4. Extract `notifications` first because it is naturally async.
5. Extract `dashboard` second because it is mostly read-only.
6. Evaluate `sales`, `customers`, and `issues` after the first extractions are
   stable.
7. Keep `users-auth` extraction for later because auth is cross-cutting and high
   risk.

## In Scope

- Backend module boundaries by domain.
- Shared backend runtime utilities.
- Domain-level OpenAPI generation and bundled contract generation.
- Deployment structure for independent Lambda functions.
- Observability, logs, request correlation, and rollback expectations.
- SQS/EventBridge evaluation for async side effects.
- Frontend contract validation updates only when contracts are reorganized.

## Out Of Scope

- Rewriting the frontend UI.
- Changing business rules without a feature-specific spec.
- Migrating away from MongoDB.
- Introducing paid infrastructure unless explicitly approved.
- Splitting every domain into a Lambda before evidence supports it.

## Risks

- Too many Lambdas can increase operational complexity faster than product value.
- Mongo connection pools may multiply across functions.
- Shared auth, tenant, date, and error behavior can drift if duplicated.
- Frontend contract checks can become fragile if contracts are scattered.
- Cross-domain transactions can become unreliable if replaced by ad hoc
  synchronous Lambda calls.

## Success Criteria

- Each backend domain has an explicit owner module and focused tests.
- Shared runtime concerns are centralized and reused.
- OpenAPI contract generation remains deterministic.
- Frontend contract checks continue to pass.
- First extracted Lambda can be deployed, rolled back, and observed
  independently.
- Production behavior remains stable for auth, tenant isolation, sales, issues,
  and dashboard flows.

## Decision Log

- 2026-06-15: Prefer modular monolith first, then selective serverless domain
  extraction. Start with low-risk async/read domains before auth or core write
  flows.
