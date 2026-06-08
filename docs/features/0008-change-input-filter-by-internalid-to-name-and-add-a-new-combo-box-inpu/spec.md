# Change input filter by internalId to name and add a new combo box input filter for filtering issue data by risk Spec

## Problem
improve issue filtering at paginated list

## Scope
change current paginate list filter by internalId to workflow name and add a new filter by risk using combobox input

## Impact Classification
- Impact: high
- Creates new domain/workflow: no
- Changes domain model: no
- Changes public API contract: yes
- Changes durable architecture/project memory: no
- Impacted canonical docs: `docs/specs/issue.spec.md`, `docs/tasks/issue.tasks.md`

This changes the issue list filtering workflow and frontend/backend query contract for `GET /issues`, but it does not create a new domain, change auth/tenant/session behavior, affect POS/payment/data-loss flows, or add durable architecture patterns.

## Domain
issue

## User Workflow
issue paginated list

## API/Data Contracts
add api GET /issues filter for workflow, risk and status

## Requirements
- REQ-ISSUE-001: combo box input must have all values from Risk enum
- REQ-ISSUE-002: default value must be All
- REQ-ISSUE-003: contracts must be updated

## UI States
- Loading: The list keeps showing the existing loading message while issue pages load.
- Error: The list keeps showing the existing loading error message when the paginated query fails.
- Empty: The list shows the existing empty issue message when filters return no records.
- Success: The list shows issues filtered by workflow and risk; risk defaults to All.

## Acceptance Criteria
- The workflow text input sends a `workflow` filter instead of an `internalId` filter.
- The risk combobox includes All, INFO, WARN, and ERROR.
- The risk combobox defaults to All.
- Selecting a risk sends that enum value as the `risk` query filter.
- All sends no risk filter value.

## Out Of Scope
- No explicit out-of-scope items yet.
