import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const authState = vi.hoisted(() => ({ token: null, user: null }));

vi.mock('./context/AuthContext', async () => {
  const actual = await vi.importActual('./context/AuthContext');
  return {
    ...actual,
    useAuth: () => authState,
  };
});

const renderRoute = (initialPath = '/products') => render(
  <MemoryRouter initialEntries={[initialPath]}>
    <Routes>
      <Route path="/login" element={<div>Login destination</div>} />
      <Route path="/change-password" element={<div>Password destination</div>} />
      <Route
        path="/products"
        element={(
          <PrivateRoute>
            <div>Protected content</div>
          </PrivateRoute>
        )}
      />
    </Routes>
  </MemoryRouter>
);

describe('PrivateRoute', () => {
  afterEach(() => {
    cleanup();
    authState.token = null;
    authState.user = null;
  });

  it('redirects unauthenticated users to login', () => {
    renderRoute();
    expect(screen.getByText('Login destination')).toBeInTheDocument();
  });

  it('redirects restricted recovery sessions to password change', () => {
    authState.token = 'restricted-token';
    authState.user = { requiresInitialPasswordChange: true };
    renderRoute();
    expect(screen.getByText('Password destination')).toBeInTheDocument();
  });

  it('renders protected content after the mandatory change is complete', () => {
    authState.token = 'full-token';
    authState.user = { requiresInitialPasswordChange: false };
    renderRoute();
    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });
});
