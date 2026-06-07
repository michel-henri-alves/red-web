---
name: red-web-ui-state-accessibility
description: Use when changing red-web UI components, forms, pages, loading/error/empty/success states, i18n copy, accessibility, responsive layout, or user-facing interactions.
---

# Red Web UI State Accessibility

## Use When
- A feature changes user-facing UI, forms, tables, filters, modals, buttons, dashboards, or copy.
- Async behavior needs loading, error, empty, and success states.
- Accessibility, keyboard behavior, labels, or responsive layout matter.

## Required Context
- active feature SDD files
- closest existing UI components and page patterns
- relevant locale files
- tests for nearby components when available

## Workflow
1. Match existing project UI patterns before adding new abstractions.
2. Add explicit loading, error, empty, and success states for async flows.
3. Use existing reusable components for filters, modals, buttons, inputs, tables, and info tags.
4. Keep user-facing copy in locale files when the surrounding flow uses i18n.
5. Ensure buttons, inputs, and interactive controls have accessible names and predictable focus behavior.
6. Verify mobile/responsive layouts when the changed surface is page-level.

## Verification
- focused Testing Library tests for user-visible behavior
- `npm run sdd:check`
- `npm run test`
- `npm run lint`
- `npm run build`

## Review Checks
- Raw objects are not rendered as React children.
- Text does not depend on missing translation keys.
- Error states are actionable and do not hide backend causes.
- Form values passed to inputs are strings/numbers/booleans, not objects.
