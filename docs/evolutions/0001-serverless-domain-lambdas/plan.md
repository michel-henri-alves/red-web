# Evolution Plan: Backend Modularization And Serverless Domain Lambdas

## Status

Planned.

## Execution Model

This evolution should be executed in phases. Each phase should become one or
more concrete SDD feature folders under `docs/features/` when implementation is
approved.

Do not execute all phases in a single change. The safest path is to keep runtime
behavior stable while improving boundaries, tests, contracts, and deployment
mechanics incrementally.

## Phase 0 - Discovery And Baseline

Objective: understand the current backend shape before moving files or splitting
runtime.

Expected work:

- Map current backend routes, controllers, services, repositories, entities,
  validations, middleware, scripts, and deploy files.
- Identify cross-domain calls and shared behavior.
- List current Lambda environment variables and secrets.
- Record current OpenAPI generation flow and frontend contract check flow.
- Capture current deployment and rollback commands.

Exit criteria:

- Domain dependency map exists.
- Current deploy/runtime assumptions are documented.
- First implementation slice is selected.

## Phase 1 - Modular Monolith

Objective: reorganize backend code by domain without changing public behavior.

Expected domain shape:

```text
src/domains/{domain}/
  routes/
  controllers/
  services/
  repositories/
  validations/
  models/
  tests/
```

Expected shared shape:

```text
src/shared/
  auth/
  tenant/
  errors/
  mongo/
  validation/
  dates/
  openapi/
```

Exit criteria:

- Existing route behavior remains compatible.
- Focused tests pass for moved domains.
- OpenAPI output remains compatible with the frontend contract check.
- No Lambda runtime split yet.

## Phase 2 - Runtime Shared Layer

Objective: prevent duplication before multiple Lambdas exist.

Expected work:

- Centralize Mongo connection handling.
- Centralize auth token validation/signing helpers.
- Centralize tenant/header extraction and validation.
- Centralize API error response format.
- Centralize Brasilia date helpers.
- Decide whether shared code remains inside the backend repo or becomes a
  package/workspace.

Exit criteria:

- Shared runtime code has tests.
- Domains depend on shared modules instead of copy/paste helpers.
- Production-style import check passes with production dependencies.

## Phase 3 - Contract Segmentation

Objective: prepare frontend/backend contracts for domain separation.

Expected work:

- Generate OpenAPI per domain.
- Generate a bundled frontend-facing OpenAPI document.
- Keep `red-web` contract validation pointed to a stable contract path.
- Add deterministic ordering/serialization where generated output can drift.

Exit criteria:

- Per-domain contracts exist.
- Bundled contract exists.
- Frontend contract check passes locally and in CI.

## Phase 4 - Extract Notifications

Objective: move email and future side effects to async serverless execution.

Expected work:

- Introduce SQS or EventBridge for notification requests.
- Make user creation or password flows publish a notification event.
- Create a notification Lambda consumer.
- Add retry/dead-letter behavior.
- Keep observable delivery status or failure logs.

Exit criteria:

- HTTP flows no longer depend on direct SMTP completion unless explicitly
  required by the business rule.
- Notification Lambda can be deployed and rolled back independently.
- Failure mode is visible in logs/alerts.

## Phase 5 - Extract Dashboard

Objective: isolate read-heavy aggregation endpoints.

Expected work:

- Move dashboard routes/services to a dedicated Lambda.
- Preserve auth and tenant enforcement.
- Preserve dashboard OpenAPI contract.
- Evaluate cache strategy per endpoint.

Exit criteria:

- Dashboard Lambda works independently.
- Frontend dashboard behavior is unchanged.
- Contract and focused dashboard tests pass.

## Phase 6 - Evaluate Core Domain Extraction

Objective: decide whether sales, customers, and issues deserve separate
Lambdas.

Evaluation criteria:

- Independent deploy frequency.
- Runtime/load profile.
- Failure isolation value.
- Data ownership clarity.
- Cross-domain transaction complexity.
- Test and contract readiness.

Recommended order if extraction is approved:

1. `issues`
2. `customers`
3. `sales`
4. `users-auth`

## Verification Strategy

Minimum checks per active phase:

- Backend focused tests for impacted domains.
- Production-style dependency/import check for Lambda runtime.
- OpenAPI generation check.
- Frontend contract check from `red-web`.
- Manual smoke test for login and one representative domain flow.
- Deploy rollback rehearsal for the first extracted Lambda.

## Documentation Updates

Update these docs as implementation starts:

- `docs/evolutions/README.md`
- `docs/evolutions/0001-serverless-domain-lambdas/spec.md`
- `docs/evolutions/0001-serverless-domain-lambdas/plan.md`
- `docs/evolutions/0001-serverless-domain-lambdas/tasks.md`
- `docs/memory/project.memory.md`
- Concrete `docs/features/<id>/spec.md`, `plan.md`, and `tasks.md` folders for
  each implementation slice.

## Open Questions

- Should shared backend code live inside `red-backend` or in a separate
  workspace/package?
- Should API Gateway expose one public API with multiple integrations, or should
  each domain have its own API path/stage?
- Should notifications be eventually consistent, or must some flows still wait
  for delivery confirmation?
- What are the acceptable free/low-cost observability defaults?
- Which domains currently share Mongo models or implicit side effects?
