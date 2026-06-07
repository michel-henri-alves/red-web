---
name: red-web-react-query-testing
description: Use when adding or changing red-web Vitest, Testing Library, React Query hook/component tests, API mocks, async UI tests, or regression coverage for frontend behavior.
---

# Red Web React Query Testing

## Use When
- A feature adds or changes tests for components, hooks, API wrappers, auth context, or async UI.
- A regression needs a focused test.
- React Query state, mutation invalidation, loading/error/empty states, or API mocks are involved.

## Required Context
- changed component/hook/API files
- nearby tests
- `src/setupTests.js`
- active feature SDD files

## Workflow
1. Test behavior visible to users or contract behavior, not implementation details.
2. Prefer Testing Library queries by role, label, text, or accessible name.
3. Mock API/hooks at the smallest stable boundary.
4. Keep React Query tests deterministic; isolate query clients when needed.
5. Cover happy path, failure path, and loading/empty states when applicable.
6. Run the narrowest relevant test command before full `npm run test`.

## Verification
- focused `npm run test -- path/to/test`
- `npm run test`
- `npm run lint`

## Review Checks
- Tests do not rely on network calls.
- Mocks are reset between tests.
- Async assertions wait for UI changes.
- Regression tests fail before the fix and pass after it when practical.
