---
name: red-web-domain-workflow
description: Use when creating or changing red-web domain pages, routes, menu entries, API modules, React Query hooks, forms, detail views, list views, locale keys, or canonical frontend domain docs.
---

# Red Web Domain Workflow

## Use When
- A feature creates or changes a frontend domain workflow.
- Code touches `src/pages/{domain}`, `src/shared/api`, `src/shared/hooks`, routes, menu entries, forms, lists, details, or locale files.
- A backend domain becomes visible in the frontend.

## Required Context
- `docs/sdd/constitution.md`
- active feature `spec.md`, `plan.md`, and `tasks.md`
- impacted `docs/specs/{domain}.spec.md` and `docs/tasks/{domain}.tasks.md`, when present
- closest existing domain page/hook/API/form/list/detail pattern

## Workflow
1. Classify impact. New frontend domains/workflows are high impact.
2. Keep ownership boundaries:
   - pages compose domain screens
   - `src/shared/api/{Domain}Api.js` owns HTTP calls
   - `src/shared/hooks/use{Domain}.js` owns React Query orchestration
   - reusable UI stays in `src/components`
   - route/menu access stays in routing and menu files
3. Add loading, error, empty, and success states for async user-facing behavior.
4. Add or update i18n keys when user-facing copy changes.
5. Update canonical docs for high-impact changes:
   - `docs/specs/{domain}.spec.md`
   - `docs/tasks/{domain}.tasks.md`
   - `docs/memory/project.memory.md` when durable domain-map context changes
6. Verify with `npm run sdd:check`, focused tests, `npm run test`, `npm run lint`, and `npm run build`.

## Review Checks
- API calls are not duplicated inside page components.
- Route/menu changes preserve auth and role expectations.
- Forms do not pass raw objects to inputs or JSX children.
- Locale keys exist for new user-facing labels and messages.
