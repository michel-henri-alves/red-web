import { useQuery } from "@tanstack/react-query";
import { fetchLast5DaysSales, fetchTodaySalesTotal } from "../api/DashboardApi";

const normalizeSalesByDay = (items = []) =>
  items.map((item) => ({
    day: item.day,
    sales: Number(Number(item.sales ?? 0).toFixed(2)),
  }));

const normalizeTodaySalesTotal = (total) => {
  const numericTotal = Number(total);
  return Number.isFinite(numericTotal) ? Number(numericTotal.toFixed(2)) : 0;
};

export const useLast5DaysSales = () =>
  useQuery({
    queryKey: ["dashboard", "sales", "last-5-days"],
    queryFn: async () => {
      const response = await fetchLast5DaysSales();
      return normalizeSalesByDay(response.data);
    },
    staleTime: 5 * 60 * 1000,
  });

export const useTodaySalesTotal = () =>
  useQuery({
    queryKey: ["dashboard", "sales", "total-today"],
    queryFn: async () => {
      const response = await fetchTodaySalesTotal();
      return normalizeTodaySalesTotal(response.data?.total);
    },
    staleTime: 5 * 60 * 1000,
  });
