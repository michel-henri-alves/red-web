# Frontend App Tasks

## Current Implementation Status

### ✅ Completed Features
- React app with routing and authentication
- Product, sector, customer, user, sales, POS, payment, and booklet pages
- React Query integration for API data fetching
- Axios interceptors for auth and tenant headers
- Localization support with i18next
- Shared components for tables, modals, and filters

### 🔄 In Progress Features
- None currently

### 📋 Backlog Features

#### UX Improvements
- [ ] Add mobile-friendly layout and responsive design improvements
- [ ] Improve loading skeletons for lists
- [ ] Add inline editing where appropriate
- [ ] Add better error boundary handling

#### Data Handling
- [ ] Add global error reporting for API failures
- [ ] Add optimistic updates for create/update/delete operations
- [ ] Improve query caching strategy
- [ ] Add mutation retry policies

#### Sales & POS
- [ ] Add cart persistence across page refreshes
- [ ] Add receipt printing / export
- [ ] Add payment split and refund flows
- [ ] Add sale confirmation summary

#### User Experience
- [ ] Add user profile page
- [ ] Add settings and preferences
- [ ] Add theme switcher (dark/light mode)
- [ ] Add help/documentation pages

## Technical Debt

### Code Quality
- [ ] Add frontend unit tests and integration tests
- [ ] Add Storybook for shared components
- [ ] Improve code reuse across domain pages
- [ ] Clean up deprecated hooks and TODOs

### Performance
- [ ] Optimize bundle size
- [ ] Use memoization for expensive rendering
- [ ] Improve image loading strategies
- [ ] Remove unnecessary re-renders

### Security
- [ ] Validate all user input on forms
- [ ] Improve authentication session handling
- [ ] Protect against XSS in UI display values
- [ ] Add content security policy guidance

## Known Issues

### API Integration
- Some backend endpoints may not be fully aligned with frontend expectations
- Error handling can be inconsistent across domains
- Customer booklet and payment flows need end-to-end verification

### UX
- POS keyboard shortcuts may conflict with browser behavior
- Payment page query param state can be fragile
- Unauthorized access flow should be clearer

## Next Sprint Goals

### Sprint 1: Reliability
- [ ] Add frontend tests for critical pages
- [ ] Harden API error handling
- [ ] Add user-facing retry and fallback UI

### Sprint 2: UX polish
- [ ] Improve POS workflow ergonomics
- [ ] Add booklets and pending account summaries
- [ ] Improve customer and product search

### Sprint 3: Integration
- [ ] Sync backend domain updates with frontend specs
- [ ] Add audit log views for users and sales
- [ ] Add reporting dashboards for revenue and performance
