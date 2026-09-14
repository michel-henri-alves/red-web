# User Domain Specification (Frontend)

## Overview
The User domain in `red-web` manages user login, role-based access, and user administration for the platform.

## Pages and Views
- **/login** — `LoginPage`
- **/change-password** — `ChangeInitialPassword`
- **/users** — `UserPage`
- **User list** — `UserList`
- **User create/edit** — `UserCreate`, `UserForm`
- **User details** — `UserDetails`

## Key User Stories
- As a user, I can log in with my credentials
- As a user, I can see the correct home page after login
- As a user with a generated initial password, I can replace it before normal navigation
- As an admin, I can manage users
- As an admin, I can search and filter users
- As an admin, I can create and update users

## Data and API
- Login endpoint: `POST /users/login`
- Password recovery endpoint: `POST /users/password-recovery`
- Initial password change endpoint: `POST /users/change-initial-password`
- User fetch paginated: `GET /users?name={filter}&page={page}&limit={limit}`
- Create user: `POST /users`
- Update user: `PUT /users/{id}`
- Delete user: `DELETE /users/{id}`

## Behavior
- Login page stores JWT token and user data in `localStorage`
- Login requires company ID, email and password and exposes a signed-out recovery
  action using company ID and email with non-enumerating accepted feedback.
- Users with `requiresInitialPasswordChange: true` are redirected to `/change-password`
- Successful initial password changes update local session user data to `requiresInitialPasswordChange: false`
- Axios attaches JWT token and tenant headers automatically
- Private routes are protected by `PrivateRoute`
- Role-based access is enforced by `RoleRoute`
- Unauthorized access redirects to `/unauthorized`

## Validation
- Login form validates username and password presence
- Initial password change validates current password, new password strength, and confirmation match
- Initial password strength requires at least 12 characters with lowercase, uppercase, number, and special-character classes
- User creation form validates email, username, password and role
- Frontend feedback for authentication errors is required

## UI Patterns
- Use centralized login form component patterns
- Provide role-specific navigation options
- Use private layout for authenticated pages
- Show unauthorized information when access is restricted

## Integration Notes
- User login drives the tenant and token headers used by API requests
- User administration is integrated with backend authorization rules
- The app should maintain session state across refreshes

## Password recovery verification refinement — 2026-09-08

Recovery acceptance is asynchronous: email may arrive after the generic `202`.
Restricted sessions omit the business sidebar and floating cashier so the mandatory
form has usable width on small screens. The account control has an accessible name.
Chromium/MongoDB/Mailpit verified recovery through replacement and session invalidation;
360px/1280px visual/keyboard and axe checks passed. Manual screen-reader review remains.

## ECO-0002 company-address login

TenantProvider resolves exactly one company label beneath VITE_COMPANY_BASE_DOMAIN before mounting the application. LoginPage shows the resolved display name and asks only email/password; recovery shares the resolved internal companyId. Unknown hosts/apex show instructions, lookup failures have retry states. Company resolver/login/recovery are public HTTP calls without Authorization. A mismatched login response or restored session cannot establish the tenant session.


## Definitive domain — 2026-09-11

ECO-T009 selects `tipo.click` (AWS-registered) and `<accessName>.tipo.click`. The API URL remains unchanged. The existing DNS zone is now associated with CloudFront FREE/ACTIVE. Local web production builds use the new base domain; DNS/TLS/application activation remains pending. No additional charges beyond registration/renewal are authorized for this task. See the ECO-0002 domain-migration subtask and the infrastructure run `docs/features/0002-company-access-login/runs/domain-cost-2026-09-11.md` for the actual billing verification and remaining limits.
