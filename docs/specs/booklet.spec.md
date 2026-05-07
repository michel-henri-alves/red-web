# Booklet Domain Specification (Frontend)

## Overview
The Booklet domain in `red-web` displays customer-specific pending account information and allows management of pending items.

## Pages and Views
- **/booklet** — `BookletPage`
- **Booklet list** — `BookletList`
- **Booklet details** — `BookletDetails`
- **Booklet create** — `BookletCreate`

## Key User Stories
- As a user, I can view pending entries for a selected customer
- As a user, I can create new booklet/pending items for a customer
- As a user, I can inspect details of a pending record

## Data and API
- Pending list fetches backend data by customer ID
- Create pending item with `POST /pendings`
- Update pending items with `PUT /pendings/{id}` (if supported)
- Remove pending items with `DELETE /pendings/{id}`

## Behavior
- Booklet page receives customer context via router state
- It displays a title with the customer name
- The list is paginated and supports filters
- New pending records are created from customer context

## Validation
- Amount must be a positive number
- Pending type must be valid (DEBIT/CREDIT)
- Customer context must be available when opening booklet

## UI Patterns
- Reuse list/detail patterns already used in products/customers
- Keep forms compact and customer-specific
- Display customer name and summary on header

## Integration Notes
- Booklet domain depends on customer selection from customer pages
- It links pending account management to the customer domain
- It uses backend pending API and may influence customer balance display
