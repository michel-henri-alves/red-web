# Evolution Tasks: Backend Modularization And Serverless Domain Lambdas

## Status

Planned. Do not execute automatically. Start only when this evolution is
explicitly activated.

## Activation Tasks

- [ ] T001 - Confirm that the serverless domain Lambda evolution is approved for
  execution.
  - Agent: `sdd-planner`
  - Depends on: none
  - Verification: approval recorded in this file or in a new `docs/features/*`
    folder.

- [ ] T002 - Re-check the current `red-backend`, `red-web`, and deploy state
  before implementation.
  - Agent: `sdd-planner`
  - Depends on: T001
  - Verification: current route, deploy, env, and contract notes are captured.

- [ ] T003 - Split the first implementation slice into a concrete SDD feature
  folder.
  - Agent: `sdd-planner`
  - Depends on: T002
  - Verification: `docs/features/<id>/spec.md`, `plan.md`, and `tasks.md`
    exist.

## Phase 0 - Discovery And Baseline

- [ ] T010 - Map backend route ownership by domain.
  - Agent: `sdd-planner`
  - Depends on: T003
  - Verification: route/domain map exists in the active feature notes.

- [ ] T011 - Map shared runtime concerns: auth, tenant, Mongo, errors, dates,
  OpenAPI, deploy, and env vars.
  - Agent: `implementation-engineer`
  - Depends on: T010
  - Verification: shared concern inventory exists.

- [ ] T012 - Identify the safest first module boundary to improve.
  - Agent: `code-reviewer`
  - Depends on: T011
  - Verification: selected first slice includes risk notes and rollback notes.

## Phase 1 - Modular Monolith

- [ ] T020 - Create or refine backend domain folder conventions.
  - Agent: `implementation-engineer`
  - Depends on: T012
  - Verification: backend tests and imports pass for the first moved domain.

- [ ] T021 - Move one low-risk domain into the modular structure without
  changing public behavior.
  - Agent: `implementation-engineer`
  - Depends on: T020
  - Verification: focused backend tests pass.

- [ ] T022 - Repeat modularization for remaining domains only after each prior
  move is verified.
  - Agent: `implementation-engineer`
  - Depends on: T021
  - Verification: backend test suite or agreed focused suites pass.

## Phase 2 - Runtime Shared Layer

- [ ] T030 - Centralize shared Mongo connection handling.
  - Agent: `implementation-engineer`
  - Depends on: T022
  - Verification: production-style Lambda import check passes.

- [ ] T031 - Centralize auth, tenant, error, validation, and date helpers.
  - Agent: `implementation-engineer`
  - Depends on: T030
  - Verification: focused auth/tenant/date/error tests pass.

- [ ] T032 - Remove duplicated shared helper code from domains.
  - Agent: `code-reviewer`
  - Depends on: T031
  - Verification: review confirms domains depend on shared modules.

## Phase 3 - Contract Segmentation

- [ ] T040 - Generate OpenAPI per backend domain.
  - Agent: `implementation-engineer`
  - Depends on: T032
  - Verification: per-domain contract files are generated deterministically.

- [ ] T041 - Generate a bundled frontend-facing OpenAPI contract.
  - Agent: `implementation-engineer`
  - Depends on: T040
  - Verification: bundled contract exists and is stable.

- [ ] T042 - Update `red-web` contract validation to consume the stable bundled
  contract path.
  - Agent: `implementation-engineer`
  - Depends on: T041
  - Verification: `npm run contracts:check` passes in `red-web`.

## Phase 4 - Extract Notifications

- [ ] T050 - Design notification event payloads and failure behavior.
  - Agent: `sdd-planner`
  - Depends on: T042
  - Verification: event contract is documented.

- [ ] T051 - Introduce queue/event publishing from the current backend flow.
  - Agent: `implementation-engineer`
  - Depends on: T050
  - Verification: publisher tests pass.

- [ ] T052 - Create notification Lambda consumer.
  - Agent: `implementation-engineer`
  - Depends on: T051
  - Verification: consumer tests and production-style import check pass.

- [ ] T053 - Add retry/dead-letter and observable failure path.
  - Agent: `implementation-engineer`
  - Depends on: T052
  - Verification: failure behavior is documented and testable.

## Phase 5 - Extract Dashboard

- [ ] T060 - Move dashboard endpoints behind a dedicated Lambda integration.
  - Agent: `implementation-engineer`
  - Depends on: T053
  - Verification: dashboard focused backend tests pass.

- [ ] T061 - Preserve dashboard auth, tenant, cache, and OpenAPI behavior.
  - Agent: `implementation-engineer`
  - Depends on: T060
  - Verification: dashboard contract and frontend smoke test pass.

## Phase 6 - Evaluate Core Domain Extraction

- [ ] T070 - Evaluate `issues`, `customers`, `sales`, and `users-auth` against
  extraction criteria.
  - Agent: `sdd-planner`
  - Depends on: T061
  - Verification: decision matrix exists.

- [ ] T071 - Extract the next approved core domain only after a domain-specific
  feature plan is created.
  - Agent: `implementation-engineer`
  - Depends on: T070
  - Verification: domain-specific feature folder, tests, contract checks, and
    rollback notes exist.

## Finalization

- [ ] T090 - Update architecture memory and evolution index after each completed
  phase.
  - Agent: `sdd-planner`
  - Depends on: each completed phase
  - Verification: `docs/evolutions/README.md` and
    `docs/memory/project.memory.md` are current.

- [ ] T091 - Review the completed phase for regressions, missing tests, missing
  contract updates, and deploy risks.
  - Agent: `code-reviewer`
  - Depends on: each completed phase
  - Verification: review findings are resolved or recorded as residual risk.
