---
name: red-sdd-feature-closure
description: Use when closing, reviewing, or repairing a RED SDD feature across red-web and red-backend, including spec/plan/tasks status, run evidence, canonical docs, project memory, contracts, and release readiness.
---

# Red SDD Feature Closure

## Use When
- A feature is ready to close, review, merge, or hand off.
- Tasks are marked complete or run evidence is missing.
- A high-impact feature may require canonical docs, memory, OpenAPI, or frontend contract updates.

## Required Context
- Active feature `spec.md`, `plan.md`, `tasks.md`, and latest `runs/` evidence.
- Impact Classification from both projects when the feature is cross-project.
- Impacted `docs/specs`, `docs/tasks`, `docs/memory/project.memory.md`, and contract docs.

## Workflow
1. Confirm every behavior-changing `REQ-*` has matching task coverage.
2. Confirm every completed `Txxx` has verification evidence or a clear note.
3. Check high-impact documentation obligations from Impact Classification.
4. Confirm backend OpenAPI and frontend contract checks were run when public contracts changed.
5. Confirm tests/build/lint commands match the plan and latest run evidence.
6. Leave unresolved items open instead of closing tasks optimistically.

## Verification
- `npm run sdd:check` in each touched project.
- Backend contract/test/lint commands when backend changed.
- Frontend contract/test/build commands when frontend changed.
- Review latest `docs/features/{feature}/runs/*.md`.

## Review Checks
- Specs describe final behavior, not only original intent.
- Canonical docs exist and reflect final domain/API/UI behavior.
- Project memory is updated only for durable architecture or domain-map changes.
- No feature is closed with unresolved clarification markers.
