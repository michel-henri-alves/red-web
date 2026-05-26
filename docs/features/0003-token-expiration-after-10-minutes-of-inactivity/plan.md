# Token expiration after 10 minutes of inactivity Plan

## Files
- src/shared/api/UsersApi.js
- src/shared/hooks/useUsers.js
- src/shared/utils/apiErrorFormatter.js
- src/context/AuthContext.jsx
- src/pages/LoginPage.jsx
- src/pages/UnauthorizedPage.jsx

## Context Bundle
- `docs/sdd/constitution.md`
- `docs/features/0003-token-expiration-after-10-minutes-of-inactivity/spec.md`
- `docs/features/0003-token-expiration-after-10-minutes-of-inactivity/tasks.md`
- `docs/specs/user.spec.md`
- `docs/tasks/user.tasks.md`

## Verification
- `npm run sdd:check`
- `npm run lint`
- `npm run build`
- `npm run test`

## Risks
- only users logged must access the system api and pages
