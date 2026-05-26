# RED Web SDD Workflow

## 1. Specify
Create or update `docs/features/{feature-id}/spec.md`.

The spec must include:
- Problem and user workflow
- Requirement ids (`REQ-...`)
- API/data contract assumptions
- UI states and accessibility expectations
- Acceptance criteria
- Out-of-scope items

Recommended agent: `ai/agents/sdd-spec-reviewer.md`.

## 2. Plan
Create or update `docs/features/{feature-id}/plan.md`.

The plan must include:
- Files expected to change
- Components, hooks, APIs, and routes involved
- Test or verification commands
- UX, auth, tenant, and backend risks

Recommended agent: `ai/agents/sdd-planner.md`.

## 3. Task
Create or update `docs/features/{feature-id}/tasks.md`.

Every task should reference at least one requirement id and expected verification.

## 4. Implement
Implement only the planned scope. If the code reveals a better approach, update the plan before expanding scope.

Recommended agent: `ai/agents/implementation-engineer.md`.

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

## 6. Close
Mark tasks complete and update memory only when a durable architecture decision changed.

When the feature changes the SDD process or context cost, update `docs/sdd/evaluation.md`.
