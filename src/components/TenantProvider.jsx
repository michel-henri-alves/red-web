import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { resolveCompanyAccess } from '../shared/api/CompanyAccessApi';
import { accessNameFromHost, validCompanyContext } from '../shared/utils/companyAccess';
import { clearAuthSession, readStoredUser, readStoredToken } from '../shared/utils/authSession';

const TenantContext = createContext(null);
export function TenantProvider({ children }) {
  const accessName = useMemo(() => accessNameFromHost(window.location.hostname), []);
  const [verified, setVerified] = useState(null);
  const { data, error, isPending, isFetching, refetch } = useQuery({
    queryKey: ['public-company-access', accessName],
    queryFn: async ({ signal }) => {
      const company = await resolveCompanyAccess(accessName, signal);
      if (!validCompanyContext(company, accessName)) throw new Error('Invalid company response');
      return company;
    },
    enabled: Boolean(accessName), retry: false, staleTime: 0, gcTime: 0,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (!data) return;
    if (readStoredToken() && readStoredUser()?.companyId !== data.companyId) clearAuthSession();
    setVerified(data);
  }, [data]);
  if (!accessName) return <CompanyMessage message="Abra o endereço de acesso da sua empresa. Se não souber o endereço, solicite ao responsável pela empresa." />;
  if (isPending || (!error && verified !== data)) return <CompanyMessage message="Identificando empresa..." />;
  if (error) {
    const status = error.response?.status;
    const message = status === 404 ? 'Empresa indisponível. Confira o endereço de acesso.'
      : status === 429 ? 'Muitas tentativas. Aguarde antes de tentar novamente.'
      : 'Não foi possível identificar a empresa. Verifique sua conexão e tente novamente.';
    return <CompanyMessage message={message} retry={() => refetch()} busy={isFetching} />;
  }
  return <TenantContext.Provider value={data}>{children}</TenantContext.Provider>;
}
function CompanyMessage({ message, retry, busy }) {
  return <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
    <p role="status">{message}</p>
    {retry && <button disabled={busy} onClick={retry}>Tentar novamente</button>}
  </main>;
}
export const useCompanyContext = () => useContext(TenantContext);
export function useTenant() {
  const company = useCompanyContext();
  if (!company) throw new Error('Company context unavailable');
  return company;
}
