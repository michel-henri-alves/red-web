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

Use the files in `ai/prompts/` for action-level guidance:
- `implement-from-spec.md`
- `test-generator.md`
- `refactor.md`

Use the files in `ai/agents/` for role-specific SDD work:
- `sdd-spec-reviewer.md`
- `sdd-planner.md`
- `implementation-engineer.md`
- `test-engineer.md`
- `code-reviewer.md`
- `performance-cost-reviewer.md`

Use the files in `ai/skills/` for project-specific procedure guidance when the task matches:
- `red-web-domain-workflow`
- `red-web-api-contract`
- `red-web-auth-session-tenant`
- `red-web-ui-state-accessibility`
- `red-web-react-query-testing`
- `red-web-build-deploy-config`
- `red-web-sdd-documentation-gate`

Use `docs/sdd/agents.md` for orchestration, `docs/sdd/skills.md` for skill selection, and MCP guidance from the SDD docs.

## Quality Assurance

### Testing
- Add unit tests for new components and hooks.
- Add integration tests for page flows and route behavior.
- Ensure critical interactions are covered.
- Run `npm run test` before closing behavior-changing work.

### Documentation
- Prefer feature-scoped docs in `red-web/docs/features/{feature-id}/`.
- Update domain specs in `red-web/docs/specs/` only for durable domain behavior.
- Update domain task lists in `red-web/docs/tasks/` only when maintaining legacy domain task tracking.
- Keep architecture notes aligned with implementation.

### Security
- Validate user input in forms.
- Avoid exposing sensitive data in UI logs.
- Keep authentication flows secure.
