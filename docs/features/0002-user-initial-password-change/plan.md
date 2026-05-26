# Initial Password Change Frontend Plan

## Files
- `src/pages/LoginPage.jsx`
- `src/context/AuthContext.jsx`
- `src/shared/api/UsersApi.js`
- `src/pages/user/ChangeInitialPassword.jsx`
- `src/RouteConfig.jsx`
- `src/shared/locales/pt/translation.json`
- `src/shared/locales/en/translation.json`
- `docs/specs/user.spec.md`
- `docs/tasks/user.tasks.md`

## Verification
- `npm run sdd:check`
- `npm run test`
- `npm run lint`
- `npm run build`

## Risks
- Must preserve existing login/session behavior.
- Must match backend API response and auth contract.
- Avoid exposing password values in logs or UI state beyond form state.
