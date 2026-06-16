# Evolution Plan: Assisted Manual Card Payments For POS

## Status

Planned.

## Execution Model

This evolution spans `red-web`, `red-backend`, and `red-database`. Execute it in
small feature slices. The backend payment model should be implemented before the
frontend depends on it, and the database migration should be ready before the
backend is deployed to production.

## Phase 0 - Current Flow Review

Objective: verify current POS/payment/sales behavior before changing contracts.

Expected work:

- Review `red-web` POS and payment pages.
- Review backend `sales` validation, entity, service, route, and OpenAPI output.
- Review current `paymentMethod` and `amountPaid` semantics.
- Decide whether the first implementation creates a sale draft or keeps cart
  data client-side until payment confirmation.

Exit criteria:

- The first contract shape is approved.
- Sale/payment ownership is explicit.

## Phase 1 - Backend Payment Domain

Objective: create the backend source of truth for assisted manual payments.

Expected endpoints:

```text
POST /payments/intents
GET /payments/intents/:id
POST /payments/intents/:id/manual-approval
POST /payments/intents/:id/cancel
```

Expected behavior:

- Create payment intent with company, user, amount, currency, origin, and
  idempotency key.
- Record one or more payment transactions for an intent.
- Validate manual approval evidence.
- Enforce tenant isolation.
- Emit deterministic OpenAPI contract.

Exit criteria:

- Focused backend tests pass.
- OpenAPI includes payment endpoints.
- Payment domain can run without frontend changes.

## Phase 2 - Sales Linkage

Objective: make sale finalization depend on payment state where applicable.

Expected work:

- Decide whether `POST /sales` accepts `paymentIntentId` or whether a new
  confirmation endpoint creates the sale after payment approval.
- Link sale and payment transaction.
- Preserve existing sale creation compatibility until the frontend migrates.
- Add validation for paid card sales.

Exit criteria:

- Existing sales flows remain compatible.
- New manual-payment sales are linked to approved payment records.

## Phase 3 - Database Migration

Objective: create durable storage for payment records.

Expected work in `red-database`:

- Add migration for `paymentIntents`.
- Add migration for `paymentTransactions`.
- Add indexes for company/status/date/sale/idempotency/provider evidence.
- Ensure migration runner uses `MONGO_URI` before production usage.

Exit criteria:

- Migration is idempotent.
- `npm run migrate` applies it locally.
- Post-run validation commands are documented.

## Phase 4 - Frontend POS/Payment UI

Objective: guide the cashier through manual card-machine payment.

Expected work:

- Add frontend API wrapper for payment intents.
- Add React Query hooks for payment creation, approval, cancellation, and status.
- Update payment page to create a payment intent before finalizing.
- Add manual evidence form for card-machine approval.
- Add clear states for waiting, approved, declined/canceled, failed, and retry.
- Finalize sale only after the payment intent is approved.

Exit criteria:

- Focused component/hook tests pass.
- POS manual smoke test can complete a sale.
- Error and retry states are visible.

## Phase 5 - Audit, Operations, And Documentation

Objective: make the workflow support real store operation.

Expected work:

- Document manual-payment operating procedure.
- Document cancellation rules.
- Add sales/payment troubleshooting notes.
- Update domain specs/tasks in frontend and backend.
- Update project memories where durable decisions changed.

Exit criteria:

- Operator workflow is documented.
- Residual risks are explicit.
- Future TEF/SmartPOS/gateway adapter path is preserved.

## Verification Strategy

- Backend focused tests for payment intent and manual approval.
- Backend sales integration tests for payment linkage.
- Backend OpenAPI generation.
- Frontend payment page tests.
- Frontend contract check against backend OpenAPI.
- Database migration run and index validation.
- Manual POS smoke test:
  1. Build cart.
  2. Open payment.
  3. Create payment intent.
  4. Charge external card machine.
  5. Enter NSU/authorization.
  6. Confirm sale.
  7. Verify sale and payment link.

## Cross-Repository Ownership

- `red-backend` owns payment rules, contracts, audit, and sale linkage.
- `red-web` owns cashier workflow and UI states.
- `red-database` owns migrations and indexes.

## Open Questions

- Should `POST /sales` accept `paymentIntentId`, or should
  `POST /payments/intents/:id/confirm-sale` create the sale?
- Should Pix manual payments require transaction id, end-to-end id, or optional
  notes in the first version?
- Which field should identify the physical terminal when the store has multiple
  machines?
- Should manual card evidence require both NSU and authorization code, or at
  least one of them?
- Should cash/booklet continue through the current flow or also use payment
  intents for consistency?
