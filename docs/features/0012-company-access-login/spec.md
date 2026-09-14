---
ecosystem_feature: ECO-0002
ecosystem_requirements:
  - REQ-ECO-002
  - REQ-ECO-003
  - REQ-ECO-007
  - REQ-ECO-009
  - REQ-ECO-010
  - REQ-ECO-011
  - REQ-ECO-012
project: red-web
local_feature: docs/features/0012-company-access-login
---

# Company Access Login — red-web

**Status:** implemented locally — release verification pending

## Problem

Typing internal companyId makes login unnecessarily difficult. This project implements its part of [ECO-0002](../../../../docs/features/ECO-0002-company-access-login/spec.md).

## Scope

Resolve configured tenant hostname before login/recovery; remove visible companyId field and display resolved company name.

## Impact Classification

- Impact: high
- Creates new domain/workflow: yes
- Changes domain model: no
- Changes public API contract: yes
- Changes durable architecture/project memory: yes
- Impacted canonical docs: docs/specs/user.spec.md, docs/specs/app.spec.md, docs/tasks/user.tasks.md, docs/tasks/app.tasks.md, docs/memory/project.memory.md

## Criticality

Critical — authentication and tenant context.

## Requirements

- REQ-ECO-002: Provide public exact-match resolution of an access name to only `companyId`, `accessName` and display `name` for an enabled company. No company list, autocomplete, fuzzy search, user lookup or business data is exposed. Apply bounded input validation and distributed rate limiting.
- REQ-ECO-003: On web, derive the access name from exactly one label beneath the configured application base domain, resolve it before login/recovery and display the company name. Never ask for companyId on tenant addresses. Reject unknown domains, nested subdomains and unknown companies without choosing a default tenant.
- REQ-ECO-007: Continue sending resolved companyId with email/password to existing login and with email to recovery. Preserve generic account errors, temporary-password and mandatory-change behavior. Authenticated authorization derives only from verified token claims; resolution and locally stored context grant no authorization.
- REQ-ECO-009: Provision DNS, TLS, SPA routing and API origin handling for configured tenant hosts. Use strict origin parsing and base-domain boundaries; no arbitrary reflected origin or credentials forwarded between tenant hosts. Local development uses an explicit development-only access-name setting.
- REQ-ECO-010: Cover loading, invalid input, unknown/unavailable company, throttling, offline/network failure and retry. Saved app context may render offline, but login/recovery need the backend. Revalidate saved accessName before a new login/recovery attempt; a changed companyId blocks submission and requires explicit setup.
- REQ-ECO-011: Record local and integrated verification for two companies, same email across companies, lifecycle persistence, switching races, password recovery, old-client compatibility, migration reruns and tenant hostname isolation before rollout.

- REQ-ECO-012: Use tipo.click and company subdomains under ECO-T009, preserving the current shared API and requiring verified zero additional cost beyond domain registration/renewal before activation.

## API/Data Contract

Use the exact resolver request, response, errors and normalization in the linked ecosystem specification. Keep existing login/recovery companyId payloads. No token is issued by resolution. Trusted provisioning assigns stable Company.accessName; public resolution is not authorization.

## UI States / Mobile UX And Lifecycle

Initial/loading, invalid input, company confirmation, unavailable company, throttled, offline/retry and authenticated/mandatory-change. Clear obsolete errors on edits, label controls accessibly, disable duplicate submissions and ignore stale async responses. No new permission required. Back from setup returns to prior confirmed company when available. Never persist password form state.

## Data Impact

Optional Company.accessName during migration with a unique partial index; internal IDs unchanged. Android company preference is separate from token/session data. Do not drop or rewrite existing records on rollback.

## Test Strategy

Validate the behavior slices listed in plan.md, including error paths, compatibility and two-company isolation. Runtime checks are execution tasks, not evidence claimed by this scaffold.

## MCP Sources

Source of truth: user-approved product direction, ECO-0002 specification, local source files listed in plan.md. No external service or production data queried during planning.

## Acceptance Criteria

All assigned requirements have local evidence; integration expectations in ECO-0002 pass for this project's producer/consumer responsibilities.

## Out Of Scope

Public directory, fuzzy company-name matching, QR/deep links, custom customer domains, SSO, simultaneous tenant sessions and user-facing access-name rename.


## ECO-T009 — tipo.click (2026-09-11)

The definitive application base domain is `tipo.click`, registered in AWS. Web entry is `https://<accessName>.tipo.click`; the apex gives company-access guidance. The API endpoint remains `https://7700ezljb5.execute-api.us-east-1.amazonaws.com`, including Android. Domain rollout must add no charges beyond registration/renewal. The existing Route53 zone has been associated with the active CloudFront Free plan; publication costs, certificate, reviewed company mappings and integrated acceptance remain pending. See the [domain migration subtask](../../../../docs/features/ECO-0002-company-access-login/domain-migration.md).
