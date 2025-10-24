import axiosClient from "../utils/apiBaseUrl";

const API = axiosClient("pendings");

export const create = (data) => API.post('/', data);
export const update = (id, data) => API.put(`/${id}`, data);
export const remove = (id) => API.delete(`/${id}`);
export const fetchPaginated = (filter, page, limit = 10, start, end) => API.get(`?customerId=${filter}&page=${page}&limit=${limit}&startDate=${start}&endDate=${end}`);