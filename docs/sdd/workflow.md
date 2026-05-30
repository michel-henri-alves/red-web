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

Gate: do not plan or implement while `spec.md` contains `[NEEDS CLARIFICATION: ...]`.

## 2. Plan
Create or update `docs/features/{feature-id}/plan.md`.

The plan must include:
- Files expected to change
- Components, hooks, APIs, and routes involved
- Test or verification commands
- UX, auth, tenant, and backend risks

Recommended agent: `ai/agents/sdd-planner.md`.

Gate: do not implement until `plan.md` lists expected files, tests, risks, verification commands, and any required agent handoff.

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

## 6. Close
Mark tasks complete and update memory only when a durable architecture decision changed.

When the feature changes the SDD process or context cost, update `docs/sdd/evaluation.md`.
