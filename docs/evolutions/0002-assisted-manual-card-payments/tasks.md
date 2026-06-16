# Evolution Tasks: Assisted Manual Card Payments For POS

## Status

Planned. Do not execute automatically. Start only when this evolution is
explicitly activated.

## Activation

- [ ] T001 - Confirm assisted manual card payments are approved for
  implementation.
  - Agent: `sdd-planner`
  - Depends on: none
  - Verification: approval recorded in this file or a linked `docs/features/*`
    folder.

- [ ] T002 - Create concrete feature folders in `red-web` and `red-backend`.
  - Agent: `sdd-planner`
  - Depends on: T001
  - Verification: feature `spec.md`, `plan.md`, and `tasks.md` exist in both
    repos.

## Backend And Contract Dependencies

- [ ] T010 - Define payment intent and transaction schemas in `red-backend`.
  - Agent: `implementation-engineer`
  - Depends on: T002
  - Verification: backend schema/entity tests pass.

- [ ] T011 - Add payment intent endpoints and manual approval endpoint.
  - Agent: `implementation-engineer`
  - Depends on: T010
  - Verification: route/controller/service tests pass.

- [ ] T012 - Add payment-to-sale linkage and compatibility behavior.
  - Agent: `implementation-engineer`
  - Depends on: T011
  - Verification: sales integration tests cover linked manual payment.

- [ ] T013 - Regenerate backend OpenAPI and validate frontend contract impact.
  - Agent: `implementation-engineer`
  - Depends on: T012
  - Verification: backend OpenAPI generation and `red-web` contract check pass.

## Database Dependencies

- [ ] T020 - Add `red-database` migration for payment collections and indexes.
  - Agent: `implementation-engineer`
  - Depends on: T010
  - Verification: `npm run migrate` applies the migration locally.

- [ ] T021 - Ensure `red-database` migration runner uses `MONGO_URI` before
  production execution.
  - Agent: `implementation-engineer`
  - Depends on: T020
  - Verification: migration can run with `MONGO_URI=... npm run migrate`.

## Frontend Implementation

- [ ] T030 - Add payment API wrapper and React Query hooks in `red-web`.
  - Agent: `implementation-engineer`
  - Depends on: T013
  - Verification: focused hook/API tests pass.

- [ ] T031 - Update payment page to create and display payment intent state.
  - Agent: `implementation-engineer`
  - Depends on: T030
  - Verification: payment page tests cover loading/error/success states.

- [ ] T032 - Add assisted manual card evidence form.
  - Agent: `implementation-engineer`
  - Depends on: T031
  - Verification: validation tests cover required evidence.

- [ ] T033 - Finalize sale only after approved payment intent.
  - Agent: `implementation-engineer`
  - Depends on: T032
  - Verification: POS/payment integration test covers successful manual card
    sale.

## Documentation And Review

- [ ] T040 - Update frontend specs/tasks for POS and payment.
  - Agent: `sdd-planner`
  - Depends on: T033
  - Verification: `docs/specs/payment.spec.md`, `docs/specs/pos.spec.md`, and
    related task files are current.

- [ ] T041 - Update backend specs/tasks for sales and payments.
  - Agent: `sdd-planner`
  - Depends on: T013
  - Verification: backend domain docs describe payment intent and sale linkage.

- [ ] T042 - Add operator procedure and troubleshooting notes.
  - Agent: `sdd-planner`
  - Depends on: T033
  - Verification: documentation covers charge, approval, cancellation, retry,
    and mismatch handling.

- [ ] T043 - Review the implementation for payment, audit, tenant, contract, and
  data-loss risks.
  - Agent: `code-reviewer`
  - Depends on: T040, T041, T042
  - Verification: review findings are resolved or recorded as residual risk.
