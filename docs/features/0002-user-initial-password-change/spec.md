# Initial Password Change Frontend Spec

## Problem
Users created with an initial password must be able to replace it with a strong personal password using a guided UI.

## Scope
Add UI for changing the initial password with current password, new password, confirmation, strength feedback, loading/error/success states, and API integration.

## Requirements
- REQ-WEB-PASSWORD-001: Show a password-change form when the authenticated user must change the initial password.
- REQ-WEB-PASSWORD-002: Validate required fields before submit.
- REQ-WEB-PASSWORD-003: Show password strength feedback for the new password.
- REQ-WEB-PASSWORD-004: Reject mismatched confirmation before calling the API.
- REQ-WEB-PASSWORD-005: Call backend password-change endpoint and handle success/error states.
- REQ-WEB-PASSWORD-006: After success, update auth/session state and allow normal navigation.

## API Contract Assumptions
- `POST /users/login` response user includes `requiresInitialPasswordChange` when the user must change the generated password.
- `POST /users/change-initial-password`
- Authenticated request
- Body: currentPassword, newPassword, confirmPassword
- Success message: password.changed.successfully

## Acceptance Criteria
- User can change initial password from the UI.
- Weak password feedback is visible.
- Confirmation mismatch is blocked client-side.
- API errors are shown clearly.
- Successful change updates session state.

## Out Of Scope
- Forgot-password flow.
- Admin password reset UI.
