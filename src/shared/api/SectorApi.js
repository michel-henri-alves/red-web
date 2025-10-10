import axiosClient from "../utils/apiBaseUrl";

const API = axiosClient("sectors");

export const create = (data) => API.post('/', data);
export const fetchPaginated = (filter, page, limit = 10) => API.get(`?name=${filter}&page=${page}&limit=${limit}`);
export const update = (id, data) => API.put(`/${id}`, data);
export const remove = (id) => API.delete(`/${id}`);