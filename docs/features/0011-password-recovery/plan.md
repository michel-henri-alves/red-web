# Password Recovery Web Plan

## Files

- `src/pages/LoginPage.jsx`
- `src/pages/LoginPage.test.jsx`
- `src/context/AuthContext.jsx`
- `src/context/AuthContext.test.jsx`
- `src/PrivateRoute.jsx`
- `src/PrivateRoute.test.jsx`
- `src/pages/user/ChangeInitialPassword.jsx`
- `src/pages/user/ChangeInitialPassword.test.jsx`
- `src/shared/api/UsersApi.js`
- `src/shared/hooks/useUsers.js`
- `src/shared/locales/pt/translation.json`
- `src/shared/locales/en/translation.json`

## Canonical Documentation

- Domain spec/task updates:
  - `docs/specs/user.spec.md`
  - `docs/tasks/user.tasks.md`
- Project memory update:
  - `docs/memory/project.memory.md`

## Gate Checks

- Ecosystem `companyId` plus email identity is recorded and remaining lifetime decisions are approved first.
- API status/body and mandatory-change response/session semantics match OpenAPI.
- Planned files, tests, risks and verification remain current.
- Tasks contain ids, requirements, agents, dependencies and verification.

## Agents

- Spec review: `sdd-spec-reviewer`
- Planning: `sdd-planner`
- Implementation: `implementation-engineer`
- Test: `test-engineer`
- API contract: `api-contract-reviewer`, `cross-project-integrator`
- Code review: `frontend-ux-regression-reviewer`, `security-tenant-isolation-reviewer`, `code-reviewer`

## Skills

- `red-web-auth-session-tenant`
- `red-web-ui-state-accessibility`
- `red-web-api-contract`
- `red-web-react-query-testing`
- `red-cross-project-contract-change`

## Implementation Sequence

1. Confirm final OpenAPI uses required `companyId` for login and recovery.
2. Add API/state/component tests for recovery and generic feedback.
3. Implement API wrapper/hook and accessible login recovery UI.
4. Add mandatory-change session/route tests and align existing change UI.
5. Update translations and canonical auth documentation.
6. Run focused and full gates; record evidence.

## Tests

- `src/pages/LoginPage.test.jsx`
- `src/context/AuthContext.test.jsx`
- `src/PrivateRoute.test.jsx`
- `src/pages/user/ChangeInitialPassword.test.jsx`

## Verification

- `npm run sdd:check`
- `npm run contracts:check`
- `npm run test -- --run src/pages/LoginPage.test.jsx src/context/AuthContext.test.jsx src/PrivateRoute.test.jsx src/pages/user/ChangeInitialPassword.test.jsx`
- `npm run lint`
- `npm run build`

## Risks

- Specific copy or different UI states can enumerate accounts; use only approved generic copy.
- Persisting form values or logging errors can expose passwords; keep credentials ephemeral.
- Backend/client version skew can create redirect loops or grant navigation; deploy additively and test absent/new flags.
- The login page must remain usable on narrow screens and with keyboard/screen reader.

## Definition Of Done

- [ ] All `REQ-WEB-RECOVERY-*` ids are represented in `tasks.md`.
- [ ] Every task has id, agent, dependency and verification metadata.
- [ ] Planned implementation and tests match this plan.
- [ ] Canonical user docs/tasks and project memory are updated.
- [ ] Focused accessibility, state, route and contract tests pass.
- [ ] Full gates and evidence in `runs/` pass.
- [ ] Review findings are resolved or accepted.
