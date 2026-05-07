# Test Generator Prompt

You are generating comprehensive tests for the RED frontend application. Follow these guidelines:

## Test Strategy

### Test Types
- Unit tests for individual components and hooks
- Integration tests for pages and routing flows
- API-mocking tests for data fetching

### Coverage Goals
- Cover happy paths and error states
- Test form validation and user input flows
- Verify authentication and route access behavior
- Cover multi-tenant and company-specific UI behavior

## Unit Test Generation

### Component Tests
- Use React Testing Library for UI behavior
- Mock API hooks where needed
- Test rendering, props, state changes, and user interactions

Example:
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../pages/LoginPage';

describe('LoginPage', () => {
  it('should render login form and submit credentials', async () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');

    expect(screen.getByRole('button', { name: /login/i })).toBeEnabled();
  });
});
```

### Hook Tests
- Test custom hooks in isolation
- Mock dependencies such as React Query and Axios
- Verify returned state and callback behavior

## Integration Test Generation

### Page Flow Tests
- Test login and redirect behavior
- Test navigation between authenticated routes
- Test form submission and success/error feedback
- Test role-protected routes using `RoleRoute`

### API Mocking
- Mock backend API responses for success and failure
- Validate loading and error UI states
- Ensure retry and fallback logic works

## Validation Tests
- Test form validation rules and error messages
- Verify required fields and invalid input handling
- Check boundary cases for dates, amounts, and quantities

## Test Structure
- Keep tests clear and descriptive
- Use `describe` blocks for grouping related behavior
- Use `beforeEach` to reset mocks and render state
- Clean up after tests if needed
