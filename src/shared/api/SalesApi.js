import axiosClient from "../utils/apiBaseUrl";

// const API = axiosClient("sales");
const DOMAIN = "/sales";


export const create = (data) => axiosClient.post(DOMAIN, data);
export const fetchPaginated = (page, limit = 10, start, end) => axiosClient.get(`${DOMAIN}?startDate=${start}&endDate=${end}&page=${page}&limit=${limit}`);