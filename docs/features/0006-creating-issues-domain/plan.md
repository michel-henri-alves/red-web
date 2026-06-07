# Creating issues domain Plan

## Files
- `docs/features/0006-creating-issues-domain/spec.md`
- `docs/features/0006-creating-issues-domain/plan.md`
- `docs/features/0006-creating-issues-domain/tasks.md`
- `docs/specs/issue.spec.md`
- `docs/tasks/issue.tasks.md`
- `src/RouteConfig.jsx`
- `src/components/MenuResponsive.jsx`
- `src/shared/api/IssueApi.js`
- `src/shared/hooks/useIssues.js`
- `src/pages/issue/IssuePage.jsx`
- `src/pages/issue/IssueList.jsx`
- `src/pages/issue/IssueCreate.jsx`
- `src/pages/issue/IssueDetails.jsx`
- `src/pages/issue/IssueButtons.jsx`
- `src/pages/issue/IssueForm.jsx`
- `src/pages/issue/issueMetadataFormatter.js`
- `src/pages/issue/issueMetadataFormatter.test.js`
- `src/pages/issue/IssueDetails.test.jsx`
- `src/shared/locales/en/translation.json`
- `src/shared/locales/pt/translation.json`

## Context Bundle
- `docs/sdd/constitution.md`
- `docs/features/0006-creating-issues-domain/spec.md`
- `docs/features/0006-creating-issues-domain/plan.md`
- `docs/features/0006-creating-issues-domain/tasks.md`
- `docs/specs/issue.spec.md`
- `docs/tasks/issue.tasks.md`
- Existing sector/customer domain page, API, hook, modal, list, and form patterns.

## Components, Hooks, APIs, and Routes
- Route: add authenticated `/issues` route in `src/RouteConfig.jsx`.
- Sidebar: add Issues menu item in `src/components/MenuResponsive.jsx`.
- API: isolate issue HTTP calls in `src/shared/api/IssueApi.js`.
- Hook: orchestrate issue server state in `src/shared/hooks/useIssues.js`.
- Components: compose page/list/details/buttons/create/form under `src/pages/issue/`.
- Formatter: use `src/pages/issue/issueMetadataFormatter.js` so structured `metadata` objects become readable strings before JSX or form inputs receive them.
- Reusable components: `FilterBar`, `ExpandableTable`, `Modal`, `DeleteConfirmationModal`, `FormInput`, `ActionButton`, `InfoTag`, `ProgressBar`.

## API/Data Assumptions
- `GET /issues` supports `page` and `limit` per the supplied backend contract.
- The UI filter sends the same value as `internalId` and `workflow` so users can search either field; if the backend ignores unsupported query keys, internal id filtering still follows the documented contract.
- Issue records expose `_id` for mutations plus display fields `internalId`, `workflow`, `details`, `risk`, `status`, `sponsor`, `metadata`, and audit metadata when present.
- `metadata` may be a string or structured object. The UI must format objects before rendering details and serialize objects before passing them to text inputs.

## Tests
- `src/pages/issue/issueMetadataFormatter.test.js`
- `src/pages/issue/IssueDetails.test.jsx`
- Focused verification is `npm run test -- src/pages/issue/issueMetadataFormatter.test.js src/pages/issue/IssueDetails.test.jsx` plus full project `npm run test`, `npm run lint`, and `npm run build`.

## Verification
- `npm run sdd:check`
- `npm run test -- src/pages/issue/issueMetadataFormatter.test.js src/pages/issue/IssueDetails.test.jsx`
- `npm run test`
- `npm run lint`
- `npm run build`

## Risks
- Backend workflow filtering support is not explicit in the supplied GET contract.
- Role restrictions for Issues are absent from the supplied contract; the route is authenticated without extra `RoleRoute` constraints to avoid inventing permissions.
- Issue status/risk values are free text because fixed backend enums were not provided.
- Rendering `metadata` without formatting causes React to throw when the backend returns a structured object.

## Required Agent Handoff
- Implementation engineer for T002, T004, T006, T008, and verification tasks.
- Code reviewer after implementation if final verification fails or backend contract assumptions change.
