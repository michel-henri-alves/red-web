# Feature Plan Template

## Files
- `path/to/file.jsx`

## Canonical Documentation
- Domain spec/task updates:
  - `docs/specs/{domain}.spec.md`
  - `docs/tasks/{domain}.tasks.md`
- Project memory update:
  - `docs/memory/project.memory.md`
- Required when `spec.md` classifies the feature as high impact, creates a new domain/workflow, changes a domain model, changes a public API contract, or changes durable architecture/project memory.

## Gate Checks
- Spec has no `[NEEDS CLARIFICATION: ...]` markers.
- Spec includes `Impact Classification`.
- Plan lists the expected files, tests, risks, and verification commands before implementation.
- High-impact work lists canonical documentation updates in this plan and in `tasks.md`.
- Tasks are split into `T001`, `T002`, ... with `REQ-*`, agent, dependency, and verification metadata.

## Agents
- Spec review:
- Planning:
- Implementation:
- Test:
- Code review:

## Tests
- `path/to/file.test.jsx`

## Verification
- `npm run sdd:check`
- `npm run test`
- `npm run lint`
- `npm run build`

## Risks
- Note UX, auth, tenant, backend contract, compatibility, or rollout risks.

## Definition Of Done
- [ ] All `REQ-*` ids in `spec.md` are represented in `tasks.md`.
- [ ] Every task has a `Txxx` id, assigned agent, dependency note, and verification command or check.
- [ ] Planned files match the implemented scope or the plan was updated.
- [ ] High-impact canonical docs listed in `Impact Classification` were created or updated.
- [ ] Focused automated tests were added or an explicit exception was recorded.
- [ ] Verification commands passed and were recorded in `runs/`.
- [ ] Code review findings are resolved or accepted as residual risk.
