import axiosClient from "../utils/apiBaseUrl";

const DOMAIN = "/issues";

export const create = (data) => axiosClient.post(DOMAIN, data);

export const fetchByInternalId = (internalId) =>
    axiosClient.get(`${DOMAIN}/by-internalid/${internalId}`);

export const fetchPaginated = ({ workflow = "", risk = "", status = "" } = {}, page, limit = 10) => {
    const params = {
        page,
        limit,
    };

    if (workflow) params.workflow = workflow;
    if (risk) params.risk = risk;
    if (status) params.status = status;

    return axiosClient.get(DOMAIN, { params });
};

export const update = (id, data) => axiosClient.put(`${DOMAIN}/${id}`, data);

export const remove = (id) => axiosClient.delete(`${DOMAIN}/${id}`);
