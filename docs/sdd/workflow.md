# RED Web SDD Workflow

## 1. Specify
Create or update `docs/features/{feature-id}/spec.md`.

The spec must include:
- Problem and user workflow
- Impact classification: `low`, `medium`, or `high`
- Whether the feature creates a new domain/workflow, changes a domain model, changes a public API contract, or changes durable project memory
- Impacted canonical docs when the feature is high impact
- Requirement ids (`REQ-...`)
- API/data contract assumptions
- UI states and accessibility expectations
- Acceptance criteria
- Out-of-scope items

Classify a frontend feature as high impact when it creates a new domain/workflow, changes domain data assumptions, changes a public backend/frontend contract, changes auth/tenant/role/session behavior, affects POS/payment/data-loss flows, changes durable project memory, or introduces a reusable architecture pattern.

Recommended agent: `ai/agents/sdd-spec-reviewer.md`.

Gate: do not plan or implement while `spec.md` contains `[NEEDS CLARIFICATION: ...]`.

When the feature touches a specialized concern, load `docs/sdd/skills.md` and the matching `ai/skills/{skill}/SKILL.md` file before agent work. Use the smallest matching skill set.

## 2. Plan
Create or update `docs/features/{feature-id}/plan.md`.

The plan must include:
- Files expected to change
- Canonical documentation expected to change for high-impact work
- Components, hooks, APIs, and routes involved
- Test or verification commands
- UX, auth, tenant, and backend risks

Recommended agent: `ai/agents/sdd-planner.md`.

Gate: do not implement until `plan.md` lists expected files, tests, risks, verification commands, and any required agent handoff.

For high-impact documentation work, the SDD Planner must add a task to update canonical docs. New domains/workflows and domain model changes must update or create `docs/specs/{domain}.spec.md` and `docs/tasks/{domain}.tasks.md`. Durable architecture or domain-map changes must update `docs/memory/project.memory.md`.

Use skills during planning:
- `red-web-domain-workflow` for domain pages, routes, menus, API modules, hooks, forms, lists, details, and locales.
- `red-web-api-contract` for backend/frontend payloads, filters, pagination, status/error handling, and contract drift.
- `red-web-auth-session-tenant` for login, auth context, roles, protected routes, tenant/company context, and headers.
- `red-web-ui-state-accessibility` for UI states, i18n, accessibility, responsive layout, and user-facing interactions.
- `red-web-react-query-testing` for Vitest, Testing Library, React Query, API mocks, and regression tests.
- `red-web-build-deploy-config` for Vite env vars, API base URL, production bundle behavior, and deploy docs.
- `red-web-sdd-documentation-gate` for high-impact documentation and closure gates.

## 3. Task
Create or update `docs/features/{feature-id}/tasks.md`.

Every task should:
- use a stable `Txxx` id such as `T001`;
- reference at least one `REQ-*` id;
- name the responsible agent;
- state dependencies;
- include an expected verification command or check.

Gate: prefer one LLM implementation run per pending task when scope is non-trivial.

## 4. Implement
Implement only the planned scope. If the code reveals a better approach, update the plan before expanding scope.

Recommended agent: `ai/agents/implementation-engineer.md`.

For focused execution, pass a task id to the adapter:

```bash
ai/adapters/codex.sh NNNN-feature-slug implement T003
```

## 5. Verify
Run:

```bash
npm run sdd:check
npm run test
npm run lint
npm run build
```

If a test runner is configured, also run the narrowest relevant test command.

Recommended agents:
- `ai/agents/test-engineer.md`
- `ai/agents/code-reviewer.md`
- `ai/agents/performance-cost-reviewer.md` for performance-sensitive or high-cost changes

The reviewer should mention `Skills used` when a project skill affected the review.

## 6. Close
Mark tasks complete and update memory only when a durable architecture decision changed.

Before closing high-impact work, confirm that canonical documentation listed in `Impact Classification` exists and reflects the final implementation. The Code Reviewer must block closure when a high-impact feature changed a domain/workflow, public contract, or durable project memory without the corresponding SDD documentation update.

When the feature changes the SDD process or context cost, update `docs/sdd/evaluation.md`.
