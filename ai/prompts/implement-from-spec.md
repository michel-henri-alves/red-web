# Implement from Specification Prompt

You are implementing a feature for the RED frontend application. Follow these steps:

## Step 1: Understand the Specification
Read the provided specification document carefully. Identify:
- Required pages and UI workflows
- API endpoints and payload shapes
- Validation requirements and user interactions
- Data flow between components, hooks, and pages
- Multi-tenancy and auth requirements

## Step 2: Analyze the Existing Codebase
Review existing frontend patterns:
- Page components in `src/pages/`
- API wrappers in `src/shared/api/`
- React Query hooks in `src/shared/hooks/`
- Shared components in `src/components/`
- Routing in `src/RouteConfig.jsx`
- Form handling and validation patterns
- Authentication and role-based route guards

## Step 3: Plan Implementation
Create a clear implementation plan:
- Files to create or modify
- Component structure and prop flow
- API calls and data fetching strategy
- Validation and form behavior
- Navigation and state transitions
- Error and loading states

## Step 4: Implement Core Components
### Pages
- Use page-level components for routes.
- Keep page logic focused on data loading and layout.
- Delegate reusable UI to shared components.

### API and Hooks
- Use `src/shared/api` for backend calls.
- Use React Query hooks for server state.
- Keep API endpoint definitions centralized.

### UI and Forms
- Use `react-hook-form` for form state where applicable.
- Validate inputs clearly and display localized messages.
- Keep actions accessible and keyboard-friendly.

### Navigation
- Use React Router routes and route state for page transitions.
- Keep private and role-based routes consistent with existing patterns.

### Feedback and Errors
- Show loading indicators for async operations.
- Use toast notifications for success/error feedback.
- Handle network and authorization errors gracefully.

### Testing and Documentation
- Add or update tests for new page flows.
- Update frontend spec and task documentation.
- Keep implementation aligned with the provided spec.
