import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { TenantProvider } from './TenantProvider';
import { resolveCompanyAccess } from '../shared/api/CompanyAccessApi';
import { accessNameFromHost } from '../shared/utils/companyAccess';
vi.mock('../shared/api/CompanyAccessApi', () => ({ resolveCompanyAccess: vi.fn() }));
vi.mock('../shared/utils/companyAccess', async (original) => ({ ...await original(), accessNameFromHost: vi.fn() }));
beforeEach(() => { accessNameFromHost.mockReturnValue('loja-a'); });
afterEach(() => { cleanup(); localStorage.clear(); vi.resetAllMocks(); });
const renderProvider = () => render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
  <TenantProvider><p>Protected child</p></TenantProvider>
</QueryClientProvider>);
it('REQ-ECO-003 waits for resolution before mounting children and rejects stale tenant session', async () => {
  let complete;
  resolveCompanyAccess.mockReturnValue(new Promise((resolve) => { complete = resolve; }));
  localStorage.setItem('token', 'existing-token');
  localStorage.setItem('user', JSON.stringify({ companyId: 'other' }));
  renderProvider();
  expect(screen.queryByText('Protected child')).toBeNull();
  complete({ companyId: 'a', accessName: 'loja-a', name: 'Loja A' });
  await screen.findByText('Protected child');
  expect(localStorage.getItem('token')).toBeNull();
});
it('REQ-ECO-010 unavailable company cannot expose children and offers retry', async () => {
  resolveCompanyAccess.mockRejectedValue({ response: { status: 404 } });
  renderProvider();
  await screen.findByText('Empresa indisponível. Confira o endereço de acesso.');
  expect(screen.queryByText('Protected child')).toBeNull();
  expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
});
it('unknown host never submits a resolution request', async () => {
  accessNameFromHost.mockReturnValue(null);
  renderProvider();
  await waitFor(() => expect(resolveCompanyAccess).not.toHaveBeenCalled());
  expect(screen.queryByText('Protected child')).toBeNull();
});
