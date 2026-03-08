import axiosClient from "../utils/apiBaseUrl";

// const API = axiosClient("companies");
const DOMAIN = "/companies";



export const fetchByName = (name) => axiosClient.get(`${DOMAIN}/by-name/${name}`);