import axiosClient from "../utils/apiBaseUrl";

const DOMAIN = "/users";


export const login = (data) => axiosClient.post(`${DOMAIN}/login`, data);
export const create = (data) => axiosClient.post(DOMAIN, data);
export const update = (id, data) => axiosClient.put(`${DOMAIN}/${id}`, data);
export const remove = (id) => axiosClient.delete(`${DOMAIN}/${id}`);
export const fetchPaginated = (filter, page, limit = 10) => 
    axiosClient.get(DOMAIN, { params: { name: filter, page, limit } });
//export const fetchPaginated = (filter, page, limit = 10) => axiosClient.get(`${DOMAIN}?name=${filter}&page=${page}&limit=${limit}`);
