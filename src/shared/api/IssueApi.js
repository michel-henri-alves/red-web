import axiosClient from "../utils/apiBaseUrl";

const DOMAIN = "/issues";

export const create = (data) => axiosClient.post(DOMAIN, data);

export const fetchByInternalId = (internalId) =>
    axiosClient.get(`${DOMAIN}/by-internalid/${internalId}`);

export const fetchPaginated = (filter, page, limit = 10) =>
    axiosClient.get(DOMAIN, {
        params: {
            internalId: filter,
            workflow: filter,
            page,
            limit
        }
    });

export const update = (id, data) => axiosClient.put(`${DOMAIN}/${id}`, data);

export const remove = (id) => axiosClient.delete(`${DOMAIN}/${id}`);
