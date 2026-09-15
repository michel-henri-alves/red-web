const reserved = new Set(['www', 'app', 'api', 'admin', 'auth', 'mail', 'support', 'static', 'cdn', 'localhost']);
export const isAccessName = (name) => typeof name === 'string' && name.length >= 2 && name.length <= 63 &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) && !reserved.has(name);

export function accessNameFromHost(hostname, env = import.meta.env) {
  const host = hostname.toLowerCase();
  const base = (env.VITE_COMPANY_BASE_DOMAIN || '').trim().toLowerCase();
  if (env.DEV && ['localhost', '127.0.0.1', '[::1]'].includes(host)) {
    const override = (env.VITE_DEV_COMPANY_ACCESS_NAME || '').trim().toLowerCase();
    return isAccessName(override) ? override : null;
  }
  if (!base || !host.endsWith(`.${base}`)) return null;
  const label = host.slice(0, -(base.length + 1));
  return isAccessName(label) ? label : null;
}
export function validCompanyContext(company, accessName) {
  return company?.accessName === accessName && typeof company?.companyId === 'string' && company.companyId.length > 0 &&
    typeof company?.name === 'string' && company.name.length > 0;
}
