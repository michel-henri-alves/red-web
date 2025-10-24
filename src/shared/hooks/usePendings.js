import { useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
    create,
    update,
    remove,
    fetchPaginated,
} from '../api/PendingApi';

import { useApiMutation } from './useApiMutation';

export const useCreatePendings = () => useApiMutation(
    (newPending) => create(newPending), "pendings"
  );

  export const useUpdatePendings = () => useApiMutation(
    ({ id, data }) => update(id, data), "pendings"
  );

// TODO: Deprecated 
export const createPendings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newPending) => {
            return await create(newPending);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['pendings']);
        }
    });
}

// TODO: Deprecated 
export const updatePendings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['pendings']);
        },
    });
};

export const removePendings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries(['pendings']);
        },
    });
};


export const fetchAllPendingsPaginatedByCustomerId = (filter, limit = 5, startDate, endDate) => {
    const safeStartDate = startDate ?? "";
    const safeEndDate = endDate ?? "";
console.log(safeStartDate)
    
    return useInfiniteQuery({
        queryKey: ['pendings-infinite', filter, safeStartDate, safeEndDate],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchPaginated(filter, pageParam, limit, safeStartDate, safeEndDate);
            return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        keepPreviousData: true,
    });
};
