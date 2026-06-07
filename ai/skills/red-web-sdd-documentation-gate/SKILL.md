---
name: red-web-sdd-documentation-gate
description: Use when creating, reviewing, closing, or repairing red-web SDD features, especially high-impact frontend work that may require docs/specs, docs/tasks, docs/memory, context-map, workflow, or evaluation updates.
---

# Red Web SDD Documentation Gate

## Use When
- A feature is being planned, reviewed, verified, or closed.
- `Impact Classification` is high or missing.
- A change creates a new domain/workflow, changes API/auth/UI/data assumptions, or changes SDD process/cost.
- The user asks why documentation was not updated.

## Required Context
- `docs/sdd/workflow.md`
- `docs/sdd/context-map.md`
- active feature `spec.md`, `plan.md`, and `tasks.md`
- impacted `docs/specs/*`, `docs/tasks/*`, and `docs/memory/project.memory.md`
- `docs/sdd/evaluation.md` when process or context cost changes

## Workflow
1. Confirm `Impact Classification` is present and accurate.
2. For high-impact features, ensure `plan.md` and `tasks.md` list canonical documentation updates.
3. New domains/workflows or domain model assumptions must update:
   - `docs/specs/{domain}.spec.md`
   - `docs/tasks/{domain}.tasks.md`
4. Durable architecture, domain-map, or frontend integration changes must update:
   - `docs/memory/project.memory.md`
5. SDD process or context-cost changes must update:
   - `docs/sdd/evaluation.md`
   - related workflow/manual/context-map files when relevant
6. Before closure, run `npm run sdd:check` and resolve failures. Existing legacy warnings can remain if unrelated.

## Review Checks
- Every `REQ-*` is represented in `tasks.md`.
- Closed tasks have evidence or a verification note.
- Canonical docs reflect final frontend behavior and backend assumptions.
- Missing docs are either created or explicitly marked not applicable with a reason.
