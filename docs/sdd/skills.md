# RED Web SDD Skills

Skills are reusable project-specific capability guides. Agents define the role; skills define specialized procedures and checks that the role should load when the task matches.

## Skill Roster

### `red-web-domain-workflow`
- File: `ai/skills/red-web-domain-workflow/SKILL.md`
- Use for frontend domain pages, routes, menu entries, API modules, React Query hooks, forms, list/detail views, locale keys, and canonical frontend domain docs.
- Common agents: `sdd-planner`, `implementation-engineer`, `test-engineer`, `code-reviewer`.

### `red-web-api-contract`
- File: `ai/skills/red-web-api-contract/SKILL.md`
- Use for API wrappers, React Query hooks, backend payload assumptions, OpenAPI/contract usage, filters, pagination, status/error handling, and frontend/backend compatibility.
- Common agents: `sdd-spec-reviewer`, `sdd-planner`, `implementation-engineer`, `test-engineer`, `code-reviewer`.

### `red-web-auth-session-tenant`
- File: `ai/skills/red-web-auth-session-tenant/SKILL.md`
- Use for login, auth context, token/session behavior, protected routes, role routes, tenant/company context, headers, and authorization-sensitive UI.
- Common agents: `sdd-spec-reviewer`, `sdd-planner`, `implementation-engineer`, `test-engineer`, `code-reviewer`.

### `red-web-ui-state-accessibility`
- File: `ai/skills/red-web-ui-state-accessibility/SKILL.md`
- Use for UI components, forms, pages, loading/error/empty/success states, i18n copy, accessibility, responsive layout, and user-facing interactions.
- Common agents: `sdd-spec-reviewer`, `sdd-planner`, `implementation-engineer`, `test-engineer`, `code-reviewer`.

### `red-web-react-query-testing`
- File: `ai/skills/red-web-react-query-testing/SKILL.md`
- Use for Vitest, Testing Library, React Query hook/component tests, API mocks, async UI tests, and regression coverage.
- Common agents: `test-engineer`, `implementation-engineer`, `code-reviewer`.

### `red-web-build-deploy-config`
- File: `ai/skills/red-web-build-deploy-config/SKILL.md`
- Use for Vite build config, `VITE_API_BASE_URL`, API base URL resolution, production bundle behavior, deployment docs, and CI build/deploy wiring.
- Common agents: `sdd-planner`, `implementation-engineer`, `code-reviewer`, `performance-cost-reviewer`.

### `red-web-sdd-documentation-gate`
- File: `ai/skills/red-web-sdd-documentation-gate/SKILL.md`
- Use for SDD planning, review, closure, high-impact documentation, canonical specs/tasks, project memory, context map, workflow, and evaluation updates.
- Common agents: `sdd-planner`, `code-reviewer`, `performance-cost-reviewer`.

## Selection Rule
Load only the smallest skill set that matches the task. Prefer one skill for narrow work and combine skills only when the task crosses concerns.

Examples:
- New frontend domain page backed by API: `red-web-domain-workflow` + `red-web-api-contract` + `red-web-sdd-documentation-gate`.
- Login/session bug: `red-web-auth-session-tenant`.
- Async page rendering bug: `red-web-ui-state-accessibility` + `red-web-react-query-testing`.
- Production API host bug: `red-web-build-deploy-config`.
- Contract drift with backend: `red-web-api-contract`.

## Agent Handoff
Agent outputs should include a short `Skills used` line when a skill influenced the result. If an obvious skill was not used, record why it was not applicable.
