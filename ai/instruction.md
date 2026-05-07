# GitHub Copilot Instructions for RED Frontend

## Project Context
`red-web` is the frontend application for the RED multi-tenant commerce platform. It is built with React 19, Vite, React Router, React Query, Tailwind CSS, and i18next.

## Development Guidelines

### Code Style
- Use modern React idioms and hooks.
- Keep components small and focused.
- Follow existing project naming conventions.
- Use descriptive variable and function names.
- Add comments only when the code is not self-explanatory.

### Architecture Patterns
- **Pages**: `src/pages/...`
- **Shared APIs**: `src/shared/api/...`
- **Hooks**: `src/shared/hooks/...` and `src/hooks/...`
- **Components**: `src/components/...`
- **Routes**: `src/RouteConfig.jsx`
- **Forms**: use `react-hook-form` where applicable
- **State**: use React Query for server state and local hooks for UI state

### Multi-tenancy and Integration
- The app consumes backend APIs from `red-backend`.
- Include tenant headers and auth tokens in API requests.
- Keep route-based access control in sync with backend roles.
- Ensure UI behavior validates company-specific constraints.

### Error Handling
- Handle loading and error states with toast notifications or visible UI messages.
- Use consistent feedback patterns across pages.
- Redirect to `/login` on unauthorized responses.

## AI-Assisted Development

### When to Use These Prompts
- Implementing new frontend features from specs
- Writing tests for pages, hooks, and components
- Refactoring existing UI, hooks, or data fetching
- Adding documentation or architectural notes

### Prompt Usage
These prompts are vendor-agnostic and can be used with GitHub Copilot, Codex, Claude, or other capable language models.

Use the files in `.github/copilot/prompts/`:
- `implement-from-spec.prompt.md`
- `test-generator.prompt.md`
- `refactor.prompt.md`

## Quality Assurance

### Testing
- Add unit tests for new components and hooks.
- Add integration tests for page flows and route behavior.
- Ensure critical interactions are covered.

### Documentation
- Update frontend specs in `red-web/docs/specs/`.
- Update task lists in `red-web/docs/tasks/`.
- Keep architecture notes aligned with implementation.

### Security
- Validate user input in forms.
- Avoid exposing sensitive data in UI logs.
- Keep authentication flows secure.
