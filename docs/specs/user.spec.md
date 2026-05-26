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
- Initial password change endpoint: `POST /users/change-initial-password`
- User fetch paginated: `GET /users?name={filter}&page={page}&limit={limit}`
- Create user: `POST /users`
- Update user: `PUT /users/{id}`
- Delete user: `DELETE /users/{id}`

## Behavior
- Login page stores JWT token and user data in `localStorage`
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
