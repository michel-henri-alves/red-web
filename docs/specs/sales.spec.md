# Sales Domain Specification (Frontend)

## Overview
The Sales domain in `red-web` manages sales listing, details, and user-facing sales workflows.

## Pages and Views
- **/sales** — `SalesPage`
- **Sales list** — `SaleList`
- **Sale details** — `SaleDetails`

## Key User Stories
- As a user, I can view a list of sales transactions
- As a user, I can inspect sale details
- As a user, I can search or filter sales by date range
- As a POS user, I can finalize payment using sales data

## Data and API
- Fetch paginated sales with `GET /sales?startDate={start}&endDate={end}&page={page}&limit={limit}`
- Create sale with `POST /sales`

## Behavior
- Sales list should support date-range filtering
- Sales detail view should show items and payment details
- Sales creation is supported by POS and payment flow
- Sales pages should display totals and financial summaries

## Validation
- Date filter inputs should validate date ranges
- Sales data must align with backend required fields (items, paymentMethod, amountPaid, companyId)
- UI should handle empty sales and loading states gracefully

## UI Patterns
- Use reusable list/detail components for sales records
- Provide clear feedback for loading, empty lists, and errors
- Use localized labels for statuses and totals

## Integration Notes
- Sales data depends on POS flow and backend payment processing
- Sales page should reflect completed transactions from POS
- Sales records should be retrievable by authenticated company user
