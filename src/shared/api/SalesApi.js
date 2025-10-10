import axiosClient from "../utils/apiBaseUrl";

const API = axiosClient("sales");

export const create = (data) => API.post('/', data);
export const fetchPaginated = (page, limit = 10, start, end) => API.get(`?startDate=${start}&endDate=${end}&page=${page}&limit=${limit}`);