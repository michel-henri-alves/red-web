# Change input filter by internalId to name and add a new combo box input filter for filtering issue data by risk Plan

## Files
- src/pages/issue/IssueList.jsx
- src/pages/issue/IssueList.test.jsx
- src/shared/api/IssueApi.js
- src/shared/api/IssueApi.test.js
- src/shared/hooks/useIssues.js
- src/shared/locales/en/translation.json
- src/shared/locales/pt/translation.json
- docs/specs/issue.spec.md
- docs/tasks/issue.tasks.md
- docs/features/0008-change-input-filter-by-internalid-to-name-and-add-a-new-combo-box-inpu/tasks.md

## Context Bundle
- `docs/sdd/constitution.md`
- `docs/features/0008-change-input-filter-by-internalid-to-name-and-add-a-new-combo-box-inpu/spec.md`
- `docs/features/0008-change-input-filter-by-internalid-to-name-and-add-a-new-combo-box-inpu/tasks.md`
- `docs/specs/issue.spec.md`
- `docs/tasks/issue.tasks.md`

## Verification
- `npm run test -- IssueList.test.jsx`
- `npm run test -- IssueApi.test.js`
- `npm run contracts:check`
- `npm run sdd:check`
- `npm run lint`
- `npm run build`
- `npm run test`

## Risks
- Backend must support `GET /issues` query params `workflow`, `risk`, `status`, `page`, and `limit`.
- The frontend treats an empty risk value as All and sends no effective risk filter.
- The list keeps existing authenticated route behavior; this work does not alter route guards or tenant headers.
