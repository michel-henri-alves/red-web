# RED Web Quality Gates

## Critical Feature Test Policy

`red-web` does not use a global coverage threshold yet. Instead, critical
features must include focused automated tests.

Mark a feature as critical in `spec.md`:

```md
## Criticality
Critical
```

Critical features include:
- auth and session behavior
- initial password change
- POS
- payment
- tenant or company context
- route guards and roles
- backend contract-sensitive API changes
- data-loss or irreversible user actions

## Required Evidence For Critical Features
- `plan.md` must list test files under `## Tests`.
- `plan.md` must include `npm run test`.
- `tasks.md` must include a test task for each behavior-changing `REQ-*`.
- A `runs/` report should record the verification commands before closing.

## Current Strategy
- Grow tests around critical workflows first.
- Avoid a global threshold until the existing frontend has enough baseline coverage.
- Revisit global coverage once auth, POS, payment, and user management flows have stable tests.
