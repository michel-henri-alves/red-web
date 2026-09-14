import { accessNameFromHost } from '../shared/utils/companyAccess';
export const resolveTenant = () => accessNameFromHost(window.location.hostname);
