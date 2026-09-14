# Company Access Login — Execution Plan

**Status:** implemented locally — release verification pending

## Files

- `src/pages/LoginPage.jsx`
- `src/pages/LoginPage.test.jsx`
- `src/context/AuthContext.jsx`
- `src/context/AuthContext.test.jsx`
- `src/shared/hooks/useUsers.js`
- `src/shared/utils/ (new company host resolver)`
- `src/ (new company-resolution API hook and states)`
- `vite.config.*`

Paths described as new directories or patterns are planned additions; confirm exact filenames before implementation. Preserve unrelated workspace edits.

## Canonical Documentation

docs/specs/user.spec.md, docs/specs/app.spec.md, docs/tasks/user.tasks.md, docs/tasks/app.tasks.md, docs/memory/project.memory.md. Update after implementation, distinguishing intended behavior from verified behavior.

## Implementation Sequence

1. Add hostname parsing and login component tests: exact base-domain boundary, nested/unknown hosts, uppercase host, development override, slow resolution and retry.
2. Implement configured base-domain parser; allow an explicit access-name override only in development; show an instructional apex page without auto-selection.
3. Resolve before enabling login/recovery; keep companyId internal and display company name; handle 400/404/429/503 and cancel stale responses.
4. Bind session restoration to resolved companyId; reject mismatched stored session, clear auth/query state and never share host sessions through parent-domain cookies.
5. Run contract/component/build gates and two-host browser journeys; update user/app specs, tasks and project memory.

## Dependencies

Ecosystem plan owns rollout order. Backend contract and database mapping/index preparation precede consumer activation. Web activation also requires DNS/TLS/CORS readiness. Tests may start against the agreed contract before producer deployment.

## Agents

Task Agent fields identify execution roles, not a requirement to launch parallel agents. Implementation engineer, test engineer, API/backend contract reviewer, security tenant-isolation reviewer, code reviewer; infrastructure/data owner where applicable.

## Tests

- `src/pages/LoginPage.test.jsx`
- `src/context/AuthContext.test.jsx`
- Planned new test: `src/shared/utils/companyAccess.test.js`

Run from `red-web`: npm run sdd:check; npm run contracts:check; npm run test; npm run lint; npm run build.

Focused checks must include assigned acceptance scenarios from spec.md. Record exact focused commands and results in local `runs/` during execution. Use disposable data/staging for migration and deployment tests.

## Risks

Collision or incorrect company mapping can misdirect login UX; validation and token tenant checks remain mandatory. Stale asynchronous work can change selection; cancel/sequence requests. Partial deployment can strand consumers; retain old API contracts and activate clients after dependencies. Rollback keeps assigned names/index and persisted data; revert consumer activation first.

## Gate Checks

- Every requirement maps to tasks and verification.
- No unresolved product blocker; production domain and company mapping recorded before rollout.
- API contracts agree across consumers and producer.
- Canonical docs and tenant/security review completed before closure.

## Definition Of Done

Assigned requirements implemented, relevant gates passed, evidence recorded, canonical documentation updated, review findings resolved or explicitly accepted. This scaffold alone does not satisfy runtime completion.

## Implemented file refinements and release boundary

See the project diff and canonical docs for actual paths. Company resolution has dedicated service/controller/middleware and API DTOs. Database index migration is 0006 with separate operator mapping script; Android CompanyAccessApi has its own response DTO, FileCompanyContextStore uses noBackupFilesDir, and protected navigation uses a scoped ViewModelStore. Backend CORS belongs to config/companyCors.js; optional infrastructure inputs are documented in the rollout runbook.

Record actual local verification before task closure; current cross-project evidence is in ECO-0002 verification.md. Company mappings and integrated rollout remain pending. Do not interpret local implementation as a completed release.


## ECO-T009 — tipo.click (2026-09-11)

The definitive application base domain is `tipo.click`, registered in AWS. Web entry is `https://<accessName>.tipo.click`; the apex gives company-access guidance. The API endpoint remains `https://7700ezljb5.execute-api.us-east-1.amazonaws.com`, including Android. Domain rollout must add no charges beyond registration/renewal. The existing Route53 zone has been associated with the active CloudFront Free plan; publication costs, certificate, reviewed company mappings and integrated acceptance remain pending. See the [domain migration subtask](../../../../docs/features/ECO-0002-company-access-login/domain-migration.md).
