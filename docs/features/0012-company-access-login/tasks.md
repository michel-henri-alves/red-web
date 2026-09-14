# Company Access Login — Tasks

**Release evidence (2026-09-14):** deployed and verified; see [verification](runs/verification-2026-09-14.md). Broad acceptance items below remain open where real-account, accessibility/backup or complete IAM-plan evidence is still required.


- [ ] T007 - REQ-ECO-003, REQ-ECO-009, REQ-ECO-011, REQ-ECO-012 Prepare and publish tipo.click production entry (ECO-T009).
  - Done locally: VITE_COMPANY_BASE_DOMAIN=tipo.click, current API fallback in CI, two-company hostname boundary tests and explicit release-readiness gate.
  - Remaining: DNS/TLS/backend/mapping readiness and verified zero additional deployment cost before enabling COMPANY_DOMAIN_RELEASE_READY.
  - Verification: 73 web tests, contract, SDD and production build passed on 2026-09-11; actual two-host browser rollout pending.

- [ ] T001 - REQ-ECO-002, REQ-ECO-003, REQ-ECO-007, REQ-ECO-009, REQ-ECO-010, REQ-ECO-011 Add hostname parsing and login component tests: exact base-domain boundary, nested/unknown hosts, uppercase host, development override, slow resolution and retry.
  - Agent: `test-engineer`
  - Depends on: none
  - Verification: `npm run test -- src/pages/LoginPage.test.jsx src/context/AuthContext.test.jsx src/shared/utils/companyAccess.test.js`; for contract review `npm run contracts:check`; record results in runs/ (new test paths implemented in this feature)

- [ ] T002 - REQ-ECO-002, REQ-ECO-003, REQ-ECO-007, REQ-ECO-009, REQ-ECO-010, REQ-ECO-011 Implement configured base-domain parser; allow an explicit access-name override only in development; show an instructional apex page without auto-selection.
  - Agent: `implementation-engineer`
  - Depends on: T001
  - Verification: `npm run test -- src/pages/LoginPage.test.jsx src/context/AuthContext.test.jsx src/shared/utils/companyAccess.test.js`; for contract review `npm run contracts:check`; record results in runs/ (new test paths implemented in this feature)

- [ ] T003 - REQ-ECO-002, REQ-ECO-003, REQ-ECO-007, REQ-ECO-009, REQ-ECO-010, REQ-ECO-011 Resolve before enabling login/recovery; keep companyId internal and display company name; handle 400/404/429/503 and cancel stale responses.
  - Agent: `implementation-engineer`
  - Depends on: T002
  - Verification: `npm run test -- src/pages/LoginPage.test.jsx src/context/AuthContext.test.jsx src/shared/utils/companyAccess.test.js`; for contract review `npm run contracts:check`; record results in runs/ (new test paths implemented in this feature)

- [ ] T004 - REQ-ECO-002, REQ-ECO-003, REQ-ECO-007, REQ-ECO-009, REQ-ECO-010, REQ-ECO-011 Bind session restoration to resolved companyId; reject mismatched stored session, clear auth/query state and never share host sessions through parent-domain cookies.
  - Agent: `implementation-engineer`
  - Depends on: T003
  - Verification: `npm run test -- src/pages/LoginPage.test.jsx src/context/AuthContext.test.jsx src/shared/utils/companyAccess.test.js`; for contract review `npm run contracts:check`; record results in runs/ (new test paths implemented in this feature)

- [ ] T005 - REQ-ECO-002, REQ-ECO-003, REQ-ECO-007, REQ-ECO-009, REQ-ECO-010, REQ-ECO-011 Run contract/component/build gates and two-host browser journeys; update user/app specs, tasks and project memory.
  - Agent: `implementation-engineer`
  - Depends on: T004
  - Verification: npm run sdd:check; npm run contracts:check; npm run test; npm run build

- [ ] T006 - REQ-ECO-002, REQ-ECO-003, REQ-ECO-007, REQ-ECO-009, REQ-ECO-010, REQ-ECO-011 Review completed change, tenant isolation, compatibility and canonical documentation.
  - Agent: `code-reviewer`
  - Depends on: T005
  - Verification: findings resolved or documented with owner; local evidence linked to ECO-0002 verification.md
