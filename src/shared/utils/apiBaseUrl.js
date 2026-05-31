import axios from 'axios';
import {
    clearAuthSession,
    hasExpiredSession,
    readStoredToken,
    readStoredUser,
    refreshAuthToken,
    touchAuthSession,
} from './authSession';

export const resolveApiBaseURL = (env = import.meta.env) => {
    if (env.VITE_API_BASE_URL) {
        return env.VITE_API_BASE_URL;
    }

    throw new Error('VITE_API_BASE_URL is required.');
};

const axiosClient = axios.create({
    baseURL: resolveApiBaseURL(),
    headers: {
        "Content-Type": "application/json"
    }
});

axiosClient.interceptors.request.use((config) => {
    if (hasExpiredSession()) {
        clearAuthSession();
        window.location.href = "/login";
        return Promise.reject(new axios.CanceledError("Session expired"));
    }

    const token = readStoredToken();
    const user = readStoredUser();
    const tenant = user?.tenantId;
    const username = user?.name;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenant) {
        config.headers["x-tenant-id"] = tenant;
    }

    if (username) {
        config.headers["x-username"] = username;
    }

    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        const refreshedToken = response.headers?.["x-access-token"];

        if (refreshedToken) {
            refreshAuthToken(refreshedToken);
        } else if (response.config?.headers?.Authorization) {
            touchAuthSession();
        }

        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            clearAuthSession();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);
// export const attachTenantInterceptor = (getTenant) => {
//     axiosClient.interceptors.request.use((config) => {
//         const tenant = getTenant();
//         if (tenant) {
//             config.headers["x-tenant-id"] = tenant;
//         }
//         return config;
//     });
// };



export default axiosClient;
