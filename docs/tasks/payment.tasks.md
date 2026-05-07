# Payment Domain Tasks (Frontend)

## Current Implementation Status

### ✅ Completed Features
- Payment page that receives sale total and cart items
- Payment input controls and payment method selection
- Sale creation via `POST /sales`
- Success and error toast notifications

### 🔄 In Progress Features
- None currently

### 📋 Backlog Features

#### Payment Workflow
- [ ] Add validation for payment amounts and totals
- [ ] Add split-payment and mixed payment methods
- [ ] Add payment confirmation screen
- [ ] Add receipt printing or download after sale completion

#### UX Improvements
- [ ] Add clear error messages for underpayment and invalid input
- [ ] Add keyboard shortcuts for payment actions
- [ ] Add focus management for payment inputs
- [ ] Add mobile-friendly payment layout

### Technical Debt

- [ ] Add end-to-end verification for payment flow
- [ ] Improve navigation state handling between POS and payment
- [ ] Add tests for payment form submission and backend responses
- [ ] Align payment UI with backend sale schema requirements
