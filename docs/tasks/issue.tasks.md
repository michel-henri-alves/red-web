# Issue Domain Tasks (Frontend)

## Current Implementation Status

### Completed Features
- Issue management page with paginated list view.
- Issue details expansion.
- Issue internal id/workflow filtering.
- Issue create, update, and delete actions.
- Sidebar and authenticated route access.
- Structured issue metadata formatting for list details and edit forms.
- Focused metadata formatter and IssueDetails render tests.

### In Progress Features
- None currently.

### Backlog Features

#### Issue Management
- [ ] Replace free-text risk/status fields with select controls if backend enums are published.
- [ ] Add exact internal id lookup screen if product workflow requires direct lookup.
- [ ] Add issue assignment or ownership when backend exposes those fields.

#### UX Improvements
- [ ] Add structured metadata editor if users need to edit individual metadata fields instead of serialized JSON text.
- [ ] Add filter chips when more issue filters are available.

## Technical Debt

### Testing
- [x] Add focused tests that prove structured metadata does not crash IssueDetails rendering.
- [ ] Add issue API hook tests once the project has established page-level test helpers for authenticated domains.
