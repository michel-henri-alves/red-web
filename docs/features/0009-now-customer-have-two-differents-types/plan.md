# Now customer have two differents types Plan

## Files
- /home/michel/git/michel/red/red-web/src/pages/customer/**
- /home/michel/git/michel/red/red-web/src/shared/api/CustomerApi.js
- /home/michel/git/michel/red/red-web/src/shared/hooks/useCustomers.js
- /home/michel/git/michel/red/red-web/src/shared/locales/pt/translation.json
- /home/michel/git/michel/red/red-web/docs/specs/customer.spec.md
- /home/michel/git/michel/red/red-web/docs/tasks/customer.tasks.md

## Context Bundle
- `docs/sdd/constitution.md`
- `docs/features/0009-now-customer-have-two-differents-types/spec.md`
- `docs/features/0009-now-customer-have-two-differents-types/tasks.md`
- `docs/specs/customer.spec.md`
- `docs/tasks/customer.tasks.md`

## Verification
- `npm run sdd:check`
- `npm run lint`
- `npm run build`
-  `npm run test`

## Risks
- data leak between differents users with with differentes customerIds
