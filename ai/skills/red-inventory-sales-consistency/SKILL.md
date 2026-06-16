---
name: red-inventory-sales-consistency
description: Use when changing red-web POS, cart, barcode scanning, sales, payments, discounts, booklet/pending accounts, stock display, or inventory-affecting user workflows.
---

# Red Inventory Sales Consistency

## Use When
- Code touches POS, cart, payment, sales finalization, customer booklet, pending accounts, discounts, or product stock display.
- A UI flow depends on backend inventory updates after sales.
- A regression can create wrong totals, wrong stock, duplicate payments, or missing pending records.

## Required Context
- Active feature SDD files.
- `src/pages/pos`, `src/pages/sales`, `src/pages/sales/payment`, `src/pages/sales/booklet`.
- Related hooks such as `src/hooks/useCart.jsx`, `src/hooks/useBarcodeScanner.jsx`, and sales/product shared hooks.
- Backend sales/product/pending contract notes when behavior crosses projects.

## Workflow
1. Trace the user workflow from product lookup to cart, payment, sale creation, stock update, and post-sale navigation.
2. Keep money calculations, discounts, change, and pending amounts explicit and testable.
3. Preserve barcode scanner and keyboard shortcut behavior when POS code changes.
4. Show loading, error, empty, and success states for sale/payment operations.
5. Keep React Query invalidation aligned with product stock, sales dashboard, and pending/booklet data.
6. Add focused tests for totals, stock-sensitive display, payment errors, and regression cases.

## Verification
- Focused component/hook tests for changed workflow.
- `npm run sdd:check`
- `npm run contracts:check` when backend behavior is involved
- `npm run test`
- `npm run build`

## Review Checks
- UI cannot submit duplicate sales through loading-state gaps.
- Totals, discount, paid amount, change, and pending amount remain coherent.
- Product and dashboard caches are invalidated after sale creation.
- Error paths do not leave the user believing a failed sale succeeded.
