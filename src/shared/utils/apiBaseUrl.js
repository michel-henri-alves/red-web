import axios from 'axios';

// export default function axiosClient(domain) {

// return axios.create({
const axiosClient = axios.create({
    //cloud
    // baseURL: import.meta.env.VITE_API_BASE_URL + '/' + domain,
    //local
    //baseURL: 'http://192.168.1.167:3001/' + domain,
    // baseURL: import.meta.env.VITE_API_BASE_URL,
    baseURL: "http://localhost:3001/",
    headers: {
        "Content-Type": "application/json"
    }
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const tenant = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).tenantId : null;
    const username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).name : null;

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
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
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