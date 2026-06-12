# Additional fields in Sector domain Spec

## Problem
handle new parameters from Sector at backend endpoint

## Scope
increase new fields at sector forms; if not empty shown this parameters in the each list items

## Impact Classification
- Impact: high
- Creates new domain/workflow: no
- Changes domain model: yes
- Changes public API contract: no
- Changes durable architecture/project memory: no
- Impacted canonical docs: `docs/specs/sector.spec.md`, `docs/tasks/sector.tasks.md`

This feature changes Sector domain data assumptions by adding optional backend-supported fields to create, update, and detail rendering payloads. Canonical docs updated: `docs/specs/sector.spec.md` and `docs/tasks/sector.tasks.md`.

## Domain
sector

## User Workflow
sector endpoint; sector form (update/create); sector list details

## API/Data Contracts
- Sector create/update payloads may include optional `type`, `address`, `cep`, and nested `contact` fields.
- `contact` has optional `name`, `phone`, and `email` string fields.
- Empty optional fields should not block form submission.

## Requirements
- REQ-SECTOR-001: add this parameters to sector domain{"type": "string", "address": "string", "cep": "string", "contact": {"name": "string", "phone": "", "email": "string"}}
- REQ-SECTOR-002: at forms this parameters input must be positioned inside a dropdown panel with title named "Additional data"
- REQ-SECTOR-003: for each sector list items this new parameters only will be visible if not empty/not null

## UI States
- Loading: Sector list keeps the existing loading state while paginated data is fetched; save buttons show the existing saving label while submitting.
- Error: Sector list keeps the existing loading error state; create/update failures show the existing toast error feedback.
- Empty: Sector list keeps the existing empty state when no sectors are returned.
- Success: Create/update submits optional additional fields, closes the form, invalidates sector queries, and shows the existing success toast.

## Accessibility
- Additional optional inputs are grouped in a native collapsible panel titled `Additional data`.
- Inputs keep visible labels, placeholders, and existing invalid-field attributes.

## Acceptance Criteria
- new parameters will be optional

## Out Of Scope
- changes in others domains
