import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateLayout from './PrivateLayout';

const authState = vi.hoisted(() => ({ user: null }));
vi.mock('./context/AuthContext', async () => ({
  ...await vi.importActual('./context/AuthContext'), useAuth: () => authState,
}));
vi.mock('./components/MenuResponsive', () => ({ default: () => <nav>Business navigation</nav> }));
vi.mock('./components/FloatingCashierButton', () => ({ default: () => <button>Cashier</button> }));
vi.mock('./components/Header', () => ({ default: () => <header>Account</header> }));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
afterEach(cleanup);

const showLayout = () => render(<MemoryRouter initialEntries={['/change-password']}>
  <Routes><Route element={<PrivateLayout />}>
    <Route path="/change-password" element={<form aria-label="Password change" />} />
  </Route></Routes>
</MemoryRouter>);

it('keeps business navigation and cashier out of the mandatory-change screen', () => {
  authState.user = { requiresInitialPasswordChange: true };
  showLayout();
  expect(screen.getByRole('form', { name: 'Password change' })).toBeInTheDocument();
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cashier' })).not.toBeInTheDocument();
});

it('retains business navigation for unrestricted sessions', () => {
  authState.user = { requiresInitialPasswordChange: false };
  showLayout();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cashier' })).toBeInTheDocument();
});
