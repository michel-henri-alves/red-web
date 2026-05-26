import axiosClient from "../utils/apiBaseUrl";

// const API = axiosClient("companies");
const DOMAIN = "/companies";



export const fetchByCompanyId = (companyId) => axiosClient.get(`${DOMAIN}/by-company-id/${companyId}`);
