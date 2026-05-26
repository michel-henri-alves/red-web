# SDD Feature Execution Prompt

Implement the requested SDD action using the supplied feature documents.

Rules:
- Treat `docs/sdd/constitution.md` as the highest-priority project contract.
- If an `ai/agents/{agent}.md` file is supplied, follow it as the role-specific execution contract.
- Use requirement ids from the feature spec and tasks to keep work traceable.
- Read only the pages, hooks, API modules, components, routes, and locales needed for the files listed in the plan.
- Prefer existing frontend patterns over new abstractions.
- Preserve auth, tenant context, route guards, and backend API contracts.
- Include loading, error, empty, and success states when applicable.
- Run `npm run sdd:check`, `npm run test`, `npm run lint`, and `npm run build`.
- Update feature tasks when work is completed.
- If code and spec disagree, stop expanding scope and update the spec or plan explicitly.
