import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
    create,
    fetchPaginated,
    update,
    remove
} from '../api/SectorApi';

export const createSector = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries(['sectors']);
        },
    });
}

export const fetchAllSectorsPaginated = (filter, limit = 5) => {
    return useInfiniteQuery({
        queryKey: ['sectors-infinite', filter],
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


export const updateSector = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['sectors']);
        },
    });
};


export const removeSector = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries(['sectors']);
        },
    });
};