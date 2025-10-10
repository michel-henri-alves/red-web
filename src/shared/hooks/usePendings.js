import { useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
    create,
    update,
    remove,
    fetchPaginated,
} from '../api/PendingApi';


export const createPendings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries(['pendings']);
        },
    });
}

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


export const fetchAllPendingsPaginatedByCustomerId = (filter, limit = 5) => {
    return useInfiniteQuery({
        queryKey: ['pendings-infinite', filter],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchPaginated(filter, pageParam, limit);
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
