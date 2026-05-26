# RED Web SDD Context Map

Use this map to choose context instead of loading the entire frontend repository.

## Stable Context
- `docs/sdd/constitution.md`: mandatory project rules.
- `docs/sdd/workflow.md`: feature workflow.
- `docs/sdd/agents.md`: agent roles and handoff rules; load when delegating or reviewing SDD work.
- `ai/context/frontend.md`: architecture summary; load only when implementation patterns are unclear.
- `ai/agents/{agent}.md`: role-specific instructions; load only the agent being used.

## Domain Context
- Specs live in `docs/specs/{domain}.spec.md`.
- Tasks live in `docs/tasks/{domain}.tasks.md`.
- Feature work should live in `docs/features/{feature-id}/`.

## Code Map
- Routes: `src/RouteConfig.jsx`, `src/PrivateRoute.jsx`, `src/RoleRoute.jsx`
- Pages: `src/pages/{domain}/`
- Shared APIs: `src/shared/api/{Domain}Api.js`
- Shared hooks: `src/shared/hooks/use{Domain}.js`
- App hooks: `src/hooks/`
- Shared components: `src/components/`
- Locales: `src/shared/locales/{locale}/translation.json`
- Tests: colocated test files or `src/*.test.js`

## Minimal Context Bundle
For a new feature, include:
- `docs/sdd/constitution.md`
- the active `ai/agents/{agent}.md` file, when an agent role is being used
- `docs/features/{feature-id}/spec.md`
- `docs/features/{feature-id}/tasks.md`
- Domain spec and task file only for the impacted domain
- Existing files listed in the feature plan
- Closest reusable components, API wrapper, and hook for the same workflow

Avoid including every prompt, every spec, every task file, and every page in one request.

## MCP Context
Use MCP sources when the needed source of truth lives outside this repository or is too expensive to paste into context.

Recommended MCP lookups:
- Backend API contracts for endpoint, payload, auth, and tenant behavior.
- Issue tracker details for product intent and acceptance criteria.
- Design source for layout, copy, states, and interaction details.
- CI/test logs for failures that cannot be reproduced locally.

Summarize MCP findings in the agent output and keep only the relevant excerpt in follow-up prompts.
