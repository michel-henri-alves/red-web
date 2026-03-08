import axiosClient from "../utils/apiBaseUrl";

// const API = axiosClient("pendings");
const DOMAIN = "/pendings";


export const create = (data) => axiosClient.post(DOMAIN, data);
export const update = (id, data) => axiosClient.put(`${DOMAIN}/${id}`, data);
export const remove = (id) => axiosClient.delete(`${DOMAIN}/${id}`);
export const fetchPaginated = (filter, page, limit = 10, start, end) =>
    axiosClient.get(
        `${DOMAIN}?customerId=${filter}&page=${page}&limit=${limit}&startDate=${start}&endDate=${end}`
    );