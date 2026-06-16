# Planned System Evolutions

This folder stores future architecture and product evolution ideas that are not
ready for immediate implementation, but should remain easy to find, refine, and
activate when the timing is right.

Use this structure for changes that are larger than a normal feature, especially
when they affect architecture, deployment, contracts, observability, data
ownership, or multiple repositories.

## How To Use

1. Add a new folder with the next numeric id and a short slug:
   `docs/evolutions/0002-example-evolution/`.
2. Create at least these files:
   - `spec.md`: why the evolution exists, desired outcome, scope, risks.
   - `plan.md`: phased execution plan, dependencies, verification.
   - `tasks.md`: executable checklist that can be started later.
3. Keep the status in this index updated.
4. When an evolution becomes active, create or link the concrete SDD feature
   folders under `docs/features/`.
5. When an evolution creates a durable architecture decision, update
   `docs/memory/project.memory.md`.

## Status Values

- `idea`: useful idea, not evaluated enough for execution.
- `planned`: evaluated and structured, but not started.
- `active`: currently being implemented.
- `paused`: intentionally stopped, may resume later.
- `done`: completed and verified.
- `rejected`: explicitly decided not to pursue.

## Evolution Index

| ID | Status | Title | Trigger To Start | Main Files |
| --- | --- | --- | --- | --- |
| 0001 | planned | Backend modularization and serverless domain Lambdas | Start when backend architecture work is approved or when deploy/runtime pain justifies domain extraction | [spec](0001-serverless-domain-lambdas/spec.md), [plan](0001-serverless-domain-lambdas/plan.md), [tasks](0001-serverless-domain-lambdas/tasks.md) |
| 0002 | planned | Assisted manual card payments for POS | Start when the POS/payment workflow is approved to track real card-machine transactions without direct terminal integration | [spec](0002-assisted-manual-card-payments/spec.md), [plan](0002-assisted-manual-card-payments/plan.md), [tasks](0002-assisted-manual-card-payments/tasks.md) |

## Activation Checklist

Before starting an evolution:

- Confirm the business reason is still valid.
- Re-read the current backend, frontend, deploy, and contract state.
- Split the evolution into one or more concrete `docs/features/<id>/` folders.
- Define the first safe implementation slice.
- Record verification commands before implementation starts.

## Parking Lot

Add small ideas here before they deserve a full folder.

- None yet.
