# POS SDD Context Plan

## Files
- `docs/features/0001-pos-sdd-context/spec.md`
- `docs/features/0001-pos-sdd-context/tasks.md`
- `src/pages/pos/PosPage.jsx`
- `src/hooks/useCart.jsx`
- `src/hooks/useBarcodeScanner.jsx`
- `src/components/CartTable.jsx`
- `src/shared/api/ProductApi.js`

## Verification
- `npm run sdd:check`
- `npm run test`
- `npm run lint`
- `npm run build`

## Risks
- Existing local POS edits must be preserved.
- POS depends on backend smart-code behavior and payment route state.
