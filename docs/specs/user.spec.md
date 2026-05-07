# User Domain Specification (Frontend)

## Overview
The User domain in `red-web` manages user login, role-based access, and user administration for the platform.

## Pages and Views
- **/login** — `LoginPage`
- **/users** — `UserPage`
- **User list** — `UserList`
- **User create/edit** — `UserCreate`, `UserForm`
- **User details** — `UserDetails`

## Key User Stories
- As a user, I can log in with my credentials
- As a user, I can see the correct home page after login
- As an admin, I can manage users
- As an admin, I can search and filter users
- As an admin, I can create and update users

## Data and API
- Login endpoint: `POST /users/login`
- User fetch paginated: `GET /users?name={filter}&page={page}&limit={limit}`
- Create user: `POST /users`
- Update user: `PUT /users/{id}`
- Delete user: `DELETE /users/{id}`

## Behavior
- Login page stores JWT token and user data in `localStorage`
- Axios attaches JWT token and tenant headers automatically
- Private routes are protected by `PrivateRoute`
- Role-based access is enforced by `RoleRoute`
- Unauthorized access redirects to `/unauthorized`

## Validation
- Login form validates username and password presence
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
