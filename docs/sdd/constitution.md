# RED Web SDD Constitution

These rules are the stable contract for AI-assisted development in `red-web`.

## Non-Negotiables
- UI behavior must stay aligned with `red-backend` API contracts.
- Authenticated screens must preserve token and tenant context.
- Route access must stay consistent with frontend role guards and backend permissions.
- Pages own screen composition and workflow state.
- Shared API modules own HTTP calls.
- Shared hooks own server-state orchestration with React Query.
- Reusable components must remain domain-neutral unless their path is domain-specific.
- New user-facing behavior must include loading, error, empty, and success states when applicable.
- Specs, tasks, code, and verification must stay traceable through requirement ids.

## Context Rules
- Prefer the smallest context that can correctly implement the feature.
- Load this constitution first, then the feature spec, then only related pages, hooks, APIs, components, and tests.
- Do not paste all domain docs into every AI request.
- Put static context before variable feature details so providers with prompt caching can reuse it.

## Completion Rules
- A feature is not complete until acceptance criteria are satisfied.
- Update task status when implementation changes.
- Update memory only for durable architectural decisions, not routine UI work.
- If implementation diverges from a spec, update the spec or explicitly record the decision.
