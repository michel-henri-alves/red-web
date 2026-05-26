import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthProvider, mustChangeInitialPassword, useAuth } from './AuthContext';

function AuthProbe() {
  const { token, user, login, logout, updateUserSession } = useAuth();

  return (
    <div>
      <output aria-label="token">{token || 'no-token'}</output>
      <output aria-label="user-name">{user?.name || 'no-user'}</output>
      <output aria-label="initial-password">
        {String(user?.requiresInitialPasswordChange ?? false)}
      </output>
      <button
        type="button"
        onClick={() => login({
          accessToken: 'token-123',
          user: {
            id: 'user-1',
            name: 'Michel',
            requiresInitialPasswordChange: true,
          },
        })}
      >
        Login
      </button>
      <button
        type="button"
        onClick={() => updateUserSession({ requiresInitialPasswordChange: false })}
      >
        Mark password changed
      </button>
      <button type="button" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

function renderAuthProbe() {
  render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>
  );
}

describe('mustChangeInitialPassword', () => {
  it('requires a password change only when the backend flag is explicitly true', () => {
    expect(mustChangeInitialPassword({ requiresInitialPasswordChange: true })).toBe(true);
    expect(mustChangeInitialPassword({ requiresInitialPasswordChange: false })).toBe(false);
    expect(mustChangeInitialPassword({})).toBe(false);
    expect(mustChangeInitialPassword(null)).toBe(false);
  });
});

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists login data and exposes the authenticated session', () => {
    renderAuthProbe();

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByLabelText('token')).toHaveTextContent('token-123');
    expect(screen.getByLabelText('user-name')).toHaveTextContent('Michel');
    expect(screen.getByLabelText('initial-password')).toHaveTextContent('true');
    expect(localStorage.getItem('token')).toBe('token-123');
    expect(JSON.parse(localStorage.getItem('user'))).toMatchObject({
      id: 'user-1',
      name: 'Michel',
      requiresInitialPasswordChange: true,
    });
  });

  it('updates the stored user session without dropping existing fields', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify({
      id: 'user-1',
      name: 'Michel',
      requiresInitialPasswordChange: true,
    }));

    renderAuthProbe();

    fireEvent.click(screen.getByRole('button', { name: 'Mark password changed' }));

    expect(screen.getByLabelText('user-name')).toHaveTextContent('Michel');
    expect(screen.getByLabelText('initial-password')).toHaveTextContent('false');
    expect(JSON.parse(localStorage.getItem('user'))).toMatchObject({
      id: 'user-1',
      name: 'Michel',
      requiresInitialPasswordChange: false,
    });
  });

  it('clears token and user data on logout', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('user', JSON.stringify({ id: 'user-1', name: 'Michel' }));

    renderAuthProbe();

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    expect(screen.getByLabelText('token')).toHaveTextContent('no-token');
    expect(screen.getByLabelText('user-name')).toHaveTextContent('no-user');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
