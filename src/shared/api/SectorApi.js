import axiosClient from "../utils/apiBaseUrl";

// const API = axiosClient("sectors");
const DOMAIN = "/sectors";

export const create = (data) => axiosClient.post(DOMAIN, data);
export const fetchPaginated = (filter, page, limit = 10) => 
    axiosClient.get(`${DOMAIN}?name=${filter}&page=${page}&limit=${limit}`);
export const update = (id, data) => axiosClient.put(`${DOMAIN}/${id}`, data);
export const remove = (id) => axiosClient.delete(`${DOMAIN}/${id}`);