# Payment Domain Specification (Frontend)

## Overview
The Payment domain finalizes POS transactions and captures payment information before creating a sale record.

## Pages and Views
- **/payment** — `PaymentPage`
- **Payment form** — `Payment`

## Key User Stories
- As a cashier, I can enter payment details for a completed cart
- As a cashier, I can see the sale total before payment
- As a cashier, I can confirm payment and complete the sale

## Data and API
- The payment page receives total amount via query params or route state
- Payment form likely submits sales data to backend `POST /sales`
- Payment page should handle success and error states

## Behavior
- Payment page renders total and payment entry fields
- Form submission should validate payment methods and amounts
- On successful payment, navigate back to POS or sales summary
- On failure, display an error toast or message

## Validation
- Payment values must be numeric and non-negative
- Total payment should cover sale total or match expected logic
- Payment method selection is required

## UI Patterns
- Clear call-to-actions for payment confirmation
- Summary of total due alongside payment inputs
- Use reusable form components from the frontend design system

## Integration Notes
- Payment domain is tied to POS cart data
- Payment completion should create a sales record in backend
- Payment information maps to sales fields: items, paymentMethod, amountPaid, discount, change
