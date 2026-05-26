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
