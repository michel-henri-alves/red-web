---
name: red-pos-payment-workflow
description: Use when changing red-web POS, customer selection, cart, barcode input, payment finalization, booklet/pending payment flows, receipt-like summaries, or cashier workflow shortcuts.
---

# Red POS Payment Workflow

## Use When
- Code touches POS, cart, payment, customer account/booklet, cashier shortcuts, barcode scanning, or sales finalization.
- A change affects how a cashier completes or recovers from a sale.
- A UI issue risks wrong payment totals or interrupted checkout.

## Required Context
- Active feature SDD files.
- `src/pages/pos`, `src/pages/sales/payment`, `src/pages/sales/booklet`.
- `src/hooks/useCart.jsx`, `src/hooks/useBarcodeScanner.jsx`, keyboard shortcut hooks, and nearby tests.
- Sales, product, customer, and pending API hooks used by the flow.

## Workflow
1. Trace the cashier path with keyboard and pointer input.
2. Preserve cart identity, quantities, discounts, payment methods, customer selection, and pending account behavior.
3. Keep duplicate-submit protection around sale/payment mutation states.
4. Ensure scanner, shortcut, and focus behavior remains predictable.
5. Provide clear success and failure states without losing the cart unexpectedly.
6. Test totals, mutation failure, and at least one keyboard/scanner-sensitive behavior when affected.

## Verification
- Focused POS/payment tests.
- `npm run sdd:check`
- `npm run contracts:check`
- `npm run test`
- `npm run build`

## Review Checks
- Checkout cannot complete with inconsistent totals.
- Failed payment/sale does not silently clear the cart.
- Shortcut handlers do not fire in text inputs unless intended.
- Customer pending flows match backend contract.
