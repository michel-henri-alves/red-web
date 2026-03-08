import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { resolveTenant } from "../utils/resolveTenant";

const TenantContext = createContext(null);

export function TenantProvider({ children }) {
  const tenant = useMemo(() => resolveTenant(), []);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (tenant) {
      localStorage.setItem("tenantId", tenant);
    }
  }, [tenant]);


  useEffect(() => {
    async function loadTenant() {
      try {
        const res = await api.get(`/api/tenant/${tenant}`);
        setConfig(res.data);
      } catch (err) {
        setConfig(null);
      } finally {
        setLoading(false);
      }
    }

    if (tenant) {
      loadTenant();
    }
  }, [tenant]);

  return (
    <TenantContext.Provider value={{ tenant, config, loading }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }
  return context;
}