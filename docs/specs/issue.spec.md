# Issue Domain Specification (Frontend)

## Overview
The Issue domain in `red-web` supports authenticated management of backend issue records.

## Pages and Views
- **/issues** - `IssuePage`
- **Issue list** - `IssueList`
- **Issue details** - `IssueDetails`
- **Issue creation** - `IssueCreate`
- **Issue form** - `IssueForm`

## Key User Stories
- As an authenticated user, I can open Issues from the sidebar.
- As an authenticated user, I can view a paginated issue list.
- As an authenticated user, I can filter issues by workflow, risk, or status.
- As an authenticated user, I can create, edit, and delete issues.

## Data and API
- Fetch issues with `GET /issues?workflow={workflow}&risk={risk}&status={status}&page={page}&limit={limit}`
- Fetch an issue by internal id with `GET /issues/by-internalid/{internalId}`
- Create issue with `POST /issues`
- Update issue with `PUT /issues/{id}`
- Delete issue with `DELETE /issues/{id}`

## Behavior
- Issue list uses the existing infinite pagination pattern.
- Issue rows display `workflow` as the primary row title.
- Issue details display main issue fields plus audit metadata when available.
- Issue metadata may be returned by the backend as plain text or as a structured object. Details must format structured metadata before rendering it; raw objects must never be passed directly as React children.
- Issue API calls are made through `IssueApi`.
- React Query orchestration is handled by `useIssues`.

## Validation
- Frontend forms require `workflow` and `details`.
- Create payloads include `workflow`, `details`, `risk`, `sponsor`, and `metadata`.
- Update payloads include `workflow`, `details`, `risk`, `status`, `sponsor`, and `metadata`.
- Existing structured metadata is serialized for the text input when editing an issue.
- Backend validation and authorization errors are shown through the project error formatter.

## UI Patterns
- Use `ExpandableTable` rows with expandable details.
- Use `FilterBar` for the workflow filter.
- Use a risk select filter containing `All`, `INFO`, `WARN`, and `ERROR`; `All` sends no risk filter.
- Use modal forms for create and update actions.
- Use project-standard success/error toasts for mutations.

## Integration Notes
- The feature preserves the existing authenticated layout and token behavior.
- No durable architecture pattern is introduced.
