import { useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
    create,
    fetchPaginated,
} from '../api/SalesApi';

export const fetchAllSalesPaginatedAndFilteredByDate = (limit = 5, startDate, endDate) => {
  const safeStartDate = startDate ?? "";
  const safeEndDate = endDate ?? "";

  return useInfiniteQuery({
    queryKey: ["sales-infinite", safeStartDate, safeEndDate],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchPaginated(pageParam, limit, safeStartDate, safeEndDate);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    keepPreviousData: true,
  });
};

export const createSale = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries(['sales']);
        },
    });
}