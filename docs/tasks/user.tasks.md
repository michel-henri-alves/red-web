# User Domain Tasks (Frontend)

## Current Implementation Status

### ✅ Completed Features
- Login page and authentication flow
- Initial password change page and authenticated API integration
- Tenant-aware login and generic password-recovery action
- Mandatory password-change route guard for temporary sessions
- User management page and list view
- User creation and edit forms
- Role-based route authorization
- Unauthorized access page

### 🔄 In Progress Features
- None currently

### 📋 Backlog Features

#### User & Auth Management
- [x] Add password recovery flow
- [ ] Add profile and preferences page
- [ ] Add multi-factor authentication (MFA)
- [ ] Add account lockout and security notifications
- [ ] Add user role management UI

#### UX Improvements
- [x] Improve login and recovery error feedback
- [ ] Add remember-me functionality
- [ ] Add session timeout notice
- [ ] Add profile avatar support

## Technical Debt

### Code Quality
- [x] Add tests for login and recovery flows
- [x] Add mandatory password-change route tests
- [x] Guard private routes during mandatory password replacement
- [ ] Clean up localStorage user handling

### Performance
- [ ] Optimize authentication state restore
- [ ] Improve route transition performance

### Testing
- [ ] Login endpoint integration tests
- [ ] User management page tests
- [ ] Unauthorized route tests

## ECO-0002 company access login

- [x] Implement local company access-name behavior and coordinated compatibility changes.
- [ ] Complete environment-specific rollout checks and close ECO-0002 after integrated evidence and production inputs are recorded.
- Evidence and exact local verification results: docs/features/0012-company-access-login/runs/implementation-2026-09-10.md.
