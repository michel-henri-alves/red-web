# Evolution Spec: Assisted Manual Card Payments For POS

## Status

Planned.

## Problem

The current payment flow is tied to sale creation and stores payment method and
amount information as part of the sale. That is enough for simple internal
tracking, but it is fragile when the store receives real card-machine payments.
The system needs a way to guide the cashier, record card-terminal evidence, and
prepare for future TEF, SmartPOS, or gateway integrations without depending on a
specific machine brand or model now.

## Goal

Implement an assisted manual payment workflow where the cashier charges the
customer on any external card machine, then records the approved transaction in
RED before the sale is finalized.

## Architecture Responsibility

- `red-web`: cashier workflow, payment status UI, manual evidence entry, retry
  and cancel interactions.
- `red-backend`: payment intent, transaction state, validation, audit, sale
  confirmation, idempotency, and future provider integration boundary.
- `red-database`: payment collections, indexes, optional schema validators, and
  migration execution.

## Frontend Scope

- Add payment-intent flow to the POS/payment page.
- Show the amount to charge outside RED.
- Let the cashier choose payment method: credit, debit, Pix, cash, booklet, or
  another currently supported method.
- For card payments, collect manual evidence after approval:
  - NSU.
  - Authorization code.
  - Card brand.
  - Installments when credit is used.
  - Terminal identifier when known.
- Show clear states:
  - waiting for manual charge.
  - approved/manual evidence entered.
  - declined or canceled.
  - failed to confirm.
- Prevent final sale confirmation until required payment evidence is valid.

## Backend Scope

- Add a `payments` domain.
- Create payment intents before sale finalization.
- Create payment transactions linked to a future sale or sale draft.
- Validate payment amount, method, status transitions, and idempotency.
- Confirm sale only after payment state allows it.
- Preserve tenant/company isolation.
- Store audit fields for who confirmed or canceled a payment.
- Expose a provider adapter boundary even though the first provider is manual.

## Database Scope

- Add `paymentIntents` collection.
- Add `paymentTransactions` collection.
- Add indexes for company-scoped lookup, status, sale linkage, created date,
  provider transaction id, and idempotency key.
- Keep migrations executable through `npm run migrate`.
- Ensure production migrations use `MONGO_URI`, not hardcoded credentials.

## Manual Provider Rules

- Provider id: `manual-card-terminal`.
- It does not call an external API.
- Approval is recorded only after the cashier manually confirms evidence.
- Manual approval requires cashier identity from authenticated context.
- Manual approval must record at least amount, method, status, and confirmation
  timestamp.
- For card payments, NSU or authorization code should be required unless an
  explicit exception reason is recorded.

## Payment Statuses

```text
CREATED
WAITING_MANUAL_CAPTURE
APPROVED
DECLINED
CANCELED
FAILED
REFUNDED
RECONCILED
```

## Payment Methods

```text
CREDIT
DEBIT
PIX
CASH
BOOKLET
OTHER
```

## Success Criteria

- The cashier can complete a POS sale using manual card-machine evidence.
- The backend records a payment transaction before or during sale confirmation.
- A sale cannot be marked as paid by card without a valid payment transaction.
- Payment and sale records are linked.
- Contract changes are reflected in backend OpenAPI and frontend API wrappers.
- Database migrations are planned for payment collections and indexes.

## Out Of Scope

- Direct TEF integration.
- SmartPOS SDK integration.
- Gateway API integration.
- Automatic reconciliation with acquirer statements.
- Refund automation.
- PCI-sensitive card data storage.

## Decision Log

- 2026-06-15: Start with assisted manual card-terminal payments because it works
  with any machine brand/model and prepares the architecture for future direct
  integrations.
