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

Output budget:
- Keep the final response concise and implementation-focused.
- Do not paste full file contents, full diffs, or full command output.
- For successful commands, report command, status, and duration only when available.
- For failed commands, include only the relevant error lines and the next corrective action.
- Put long verification evidence in `docs/features/<feature-id>/runs/` instead of the chat/stdout response.
- Target 120 lines or fewer for the final response unless the user explicitly requests full logs.
