# Add percentage discount feature Spec

## Problem
add to user possibility for add a percentual value of discount at total value of sale

## Scope
System users can already enter a discount value for the total sale amount. Now we will add the possibility of applying this discount as a percentage.

## Domain
sales

## User Workflow
payment

## Impact Classification
- Impact: high
- Creates new domain/workflow: no
- Changes domain model: no
- Changes public API contract: no
- Changes durable architecture/project memory: no
- Impacted canonical docs:
  - `docs/specs/sales.spec.md`
  - `docs/tasks/sales.tasks.md`

## Criticality
Critical

This changes the payment workflow in the sales domain. It does not create a new backend contract or durable architecture pattern.

## API/Data Contracts
The backend sale creation payload remains unchanged. Percentage discounts are converted in the frontend to the existing absolute `discount` amount before `POST /sales`.

## Requirements
- REQ-SALES-001: add possibility of user input a percentage that will be use to discount total value of sale
- REQ-SALES-002: must follow the same rules used by actual numeric input
- REQ-SALES-003: not will accept decimal value
- REQ-SALES-004: user can use only one discount way by each sale (numeric or percentual)

## UI States
- Loading: No new async data is introduced; existing sale creation loading behavior remains unchanged.
- Error: Discount confirmation shows validation feedback when the calculated discount is negative or greater than the sale total.
- Empty: Empty discount input is treated as zero discount.
- Success: Confirming a valid percentage updates the due amount and displays the calculated absolute discount in the payment summary.

## Acceptance Criteria
- must no be a negative value
- must not be a decimal value
- user can use only one discount way by each sale (numeric or percentual)

## Out Of Scope
- remove current discount method
