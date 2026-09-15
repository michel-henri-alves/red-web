import axiosClient from '../utils/apiBaseUrl';
export const resolveCompanyAccess = (accessName, signal) =>
  axiosClient.post('/companies/resolve-access', { accessName }, { signal, timeout: 10000 }).then((response) => response.data);
