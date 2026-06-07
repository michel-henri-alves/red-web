# Add percentage discount feature Plan

## Files
- src/pages/sales/payment/AddDiscount.jsx
- src/pages/sales/payment/AddDiscount.test.jsx
- src/pages/sales/payment/Payment.jsx
- src/pages/sales/payment/PaymentPage.jsx
- src/pages/sales/SaleDetails.jsx
- src/pages/sales/SaleList.jsx
- src/shared/locales/pt/translation.json
- src/shared/locales/en/translation.json
- docs/features/0007-add-percentage-discount-feature/spec.md
- docs/features/0007-add-percentage-discount-feature/tasks.md
- docs/specs/sales.spec.md
- docs/tasks/sales.tasks.md

## Canonical Documentation
- Update `docs/specs/sales.spec.md` because this is a high-impact payment workflow change.
- Update `docs/tasks/sales.tasks.md` to record the completed sales payment discount behavior.

## Tests
- `src/pages/sales/payment/AddDiscount.test.jsx`

## Context Bundle
- `docs/sdd/constitution.md`
- `docs/features/0007-add-percentage-discount-feature/spec.md`
- `docs/features/0007-add-percentage-discount-feature/tasks.md`
- `docs/specs/sales.spec.md`
- `docs/tasks/sales.tasks.md`

## Verification
- `npm run sdd:check`
- `npm run lint`
- `npm run build`
- `npm run test`

## Risks
- realize a wrong calcule of final sales amount
