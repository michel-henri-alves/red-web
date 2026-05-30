# Feature Plan Template

## Files
- `path/to/file.jsx`

## Gate Checks
- Spec has no `[NEEDS CLARIFICATION: ...]` markers.
- Plan lists the expected files, tests, risks, and verification commands before implementation.
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
- [ ] Focused automated tests were added or an explicit exception was recorded.
- [ ] Verification commands passed and were recorded in `runs/`.
- [ ] Code review findings are resolved or accepted as residual risk.
