# Project Memory - RED Web

## Project Overview
`red-web` is the React frontend for the RED multi-tenant commerce platform. It provides authenticated browser workflows for products, customers, sectors, sales, POS, payment, booklet/pending accounts, and user administration.

The frontend is coupled to the RED backend API contracts and must preserve tenant isolation, role-based access, and auth/session behavior in every user-facing workflow.

## Technology Stack
- React 19 with Vite.
- React Router v7 for navigation.
- React Query for async server state.
- Axios for backend API calls.
- Tailwind CSS for styling.
- i18next for internationalization.
- React Hook Form for form handling.
- Vitest and Testing Library for frontend tests.

## Core Domains
1. **Authentication**: Login, protected routes, token/session behavior, and role routing.
2. **Products**: Inventory browsing and management, including smartCode integration.
3. **Customers**: Customer records used by sales and pending/booklet flows.
4. **Sectors**: Product and business categorization.
5. **Sales**: Sale creation, item management, totals, discounts, and checkout preparation.
6. **POS**: High-risk point-of-sale workflow with barcode scanning and cart interactions.
7. **Payment**: Payment finalization and backend sales contract alignment.
8. **Booklet/Pending**: Customer pending accounts and payment follow-up.
9. **Users**: User management and password-change flows.

## Architecture Decisions

### Frontend Shape
- Page-level features live under `src/pages/{domain}/`.
- API wrappers live under `src/shared/api/`.
- React Query hooks live under `src/shared/hooks/`.
- Reusable UI components live under `src/components/`.
- App-specific hooks live under `src/hooks/`.
- Route and access control live in `src/RouteConfig.jsx`, `src/PrivateRoute.jsx`, and `src/RoleRoute.jsx`.

### Integration Contract
- Backend APIs are the source of truth for payloads, auth, tenant scoping, and validation semantics.
- Axios clients must preserve authentication headers and tenant/company context.
- Frontend route permissions must remain aligned with backend authorization behavior.
- Do not silently broaden API contracts from the frontend. Update specs/contracts first when behavior changes.

### State Management
- Server state should use React Query hooks close to the domain API wrapper.
- Local workflow state should stay inside the relevant page or focused app hook.
- Avoid global state unless the state is truly cross-cutting, such as auth/session context.

### Internationalization
- User-facing copy should be represented in locale files when the surrounding feature already uses i18next.
- Login and recovery require `companyId` plus email. Recovery feedback must remain generic
  for accepted and account-mismatch outcomes. A session whose user projection has
  `requiresInitialPasswordChange=true` is redirected to `/change-password`; private
  content remains unavailable until the backend confirms replacement and the refreshed
  session is persisted.
- Preserve existing translation key style and avoid one-off hardcoded copy in translated flows.

## Key Patterns

### Protected Navigation
Route access is layered:
1. Authenticated session check.
2. Role-based route guard when needed.
3. Page-level API calls that still depend on backend authorization.

### API + Hook Pairing
For domain work, prefer this shape:
- `src/shared/api/{Domain}Api.js` for HTTP calls.
- `src/shared/hooks/use{Domain}.js` for React Query behavior.
- Page components consume hooks rather than duplicating HTTP logic.

### High-Risk Flows
POS, payment, auth/session, and role/tenant behavior require extra care:
- Keep changes narrow and traceable to `REQ-*` ids.
- Add or update focused tests when behavior changes.
- Verify against backend contracts before changing payload or response assumptions.

## SDD Usage

### Documentation Structure
```text
docs/
├── contracts/                # Backend/frontend integration contracts
├── features/                 # Feature-level SDD specs, plans, tasks, and runs
├── memory/
│   └── project.memory.md     # Durable project decisions
├── sdd/                      # SDD workflow, context map, agents, and manuals
├── specs/                    # Domain specifications
└── tasks/                    # Domain task tracking
```

### Context Loading Rules
- Load `docs/sdd/constitution.md` for all SDD work.
- Load `docs/sdd/context-map.md` to choose the smallest useful context bundle.
- Load this memory only for cross-domain architecture, durable decisions, or when project history matters.
- Do not include this memory in every implementation prompt by default.

### Verification Defaults
Frontend SDD plans should include:
- `npm run sdd:check`
- `npm run test`
- `npm run lint`
- `npm run build`

Use `npm run sdd:run -- <feature-id>` to record verification evidence. The report is compact by default; use `SDD_RUN_OUTPUT=full` only when complete logs are necessary.

### High-Impact Documentation Gate
Feature specs must classify impact with `Impact Classification`. High-impact frontend features include new domains/workflows, domain data assumption changes, public backend/frontend contract changes, auth/tenant/role/session changes, POS/payment/data-loss flows, durable project memory changes, and reusable architecture patterns.

For high-impact features, the SDD Planner must include canonical documentation updates in `plan.md` and `tasks.md`. Before closure, impacted `docs/specs/{domain}.spec.md`, `docs/tasks/{domain}.tasks.md`, and `docs/memory/project.memory.md` entries must exist or be explicitly documented as not applicable.

### SDD Skills
Project-specific skills live in `ai/skills/{skill}/SKILL.md` and are indexed by `docs/sdd/skills.md`. Agents keep their role and load only the matching skill when specialized guidance applies.

Current skills:
- `red-web-domain-workflow`: pages, routes, menu entries, API modules, hooks, forms, lists, details, locales, and canonical frontend domain docs.
- `red-web-api-contract`: backend/frontend payloads, filters, pagination, status/error handling, API wrappers, hooks, and contract checks.
- `red-web-auth-session-tenant`: login, auth context, token/session behavior, protected routes, roles, tenant/company context, and headers.
- `red-web-ui-state-accessibility`: UI states, i18n, accessibility, responsive layout, forms, and user-facing interactions.
- `red-web-react-query-testing`: Vitest, Testing Library, React Query tests, API mocks, async UI, and regression coverage.
- `red-web-build-deploy-config`: Vite env vars, `VITE_API_BASE_URL`, API base URL resolution, production bundle behavior, deploy docs, and CI build wiring.
- `red-web-sdd-documentation-gate`: impact classification, high-impact canonical docs, project memory, context map, workflow, and evaluation updates.

## Development Practices
- Prefer existing components, hooks, API wrappers, and styling conventions.
- Keep UI states explicit: loading, error, empty, and success when applicable.
- Preserve accessibility basics for interactive controls and navigation.
- Keep visual changes consistent with the existing application rather than introducing unrelated redesigns.
- Avoid broad refactors during feature implementation unless the SDD plan explicitly calls for them.

## Known Challenges
- POS and payment flows are sensitive to backend contract drift.
- Auth/session handling affects the whole app and should be tested narrowly and carefully.
- Tenant context bugs can appear as successful frontend behavior with incorrect backend scope.
- Large AI-assisted SDD runs can become expensive if prompts include too much context or outputs include full logs/diffs.

## Durable Decisions
- The backend remains the authority for business rules and tenant enforcement.
- The frontend should keep API integration code centralized in shared API modules.
- SDD feature folders are the preferred unit for non-trivial frontend changes.
- AI-generated implementation output should stay concise; long verification evidence belongs in feature `runs/`.
- Future architecture and product evolution ideas should be stored in `docs/evolutions/`.
  Each evolution should be modular and actionable, with an index entry plus
  `spec.md`, `plan.md`, and `tasks.md` files when it is mature enough to execute.


## 2026-09-07 — ADR-0001 review and pause

- Recovery login/public API calls now omit bearer tokens and are not blocked by
  expired stored sessions; public path matching is exact. Recovery validates email
  syntax and trims/lowercases input. Login email normalization is aligned.
- Verified 16 files / 57 tests, production build, backend contract and SDD checks.
  Existing bundle-size/SDD warnings remain. No commit or deployment was made.
- T008 stays open for manual accessibility/responsive and full browser-to-backend
  verification. Backend review still has concurrency and timing findings.
- User requested a pause. Resume from workspace
  `docs/features/ECO-0001-password-recovery/PAUSE.md` and local
  `docs/features/0011-password-recovery/runs/2026-09-07-review.md`.

## Password recovery follow-up — 2026-09-08

- Resumed ECO-0001. R1/R2 are resolved locally: conditional credential writes and
  durable asynchronous request acceptance with migration 0005 and a scheduled worker.
- Real MongoDB/Mailpit, Chromium and Android device journeys passed. Web mandatory
  layout now hides business navigation; axe/keyboard/360px/1280px checks passed.
- Evidence: local feature `runs/2026-09-08-follow-up.md` and ecosystem
  `docs/features/ECO-0001-password-recovery/review-2026-09-08.md`.
- Production SMTP/scheduler/capacity and manual screen-reader/TalkBack/Android
  large-font/landscape review remain. ECO-T007 is open; no release approval implied.
- No commits, PRs or deployment. Preserve unrelated workspace changes.
