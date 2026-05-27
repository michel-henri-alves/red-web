import axiosClient from "../utils/apiBaseUrl";

const DOMAIN = "/dashboard";

export const fetchLast5DaysSales = () =>
  axiosClient.get(`${DOMAIN}/sales/last-5-days`);

export const fetchTodaySalesTotal = () =>
  axiosClient.get(`${DOMAIN}/sales/total-today`);
