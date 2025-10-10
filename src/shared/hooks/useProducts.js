import { useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
    create,
    remove,
    update,
    fetchPaginated,
    fetchBySmartCode
} from '../api/ProductApi';

export const createProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
}


export const fetchAllProductsPaginated = (filter, limit = 5) => {
    return useInfiniteQuery({
        queryKey: ['products-infinite', filter],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchPaginated(filter, pageParam, limit);
            console.debug(response);
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

export const updateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
};


export const removeProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
};


export const fetchProductBySmartCode = () =>
    useMutation({
        mutationFn: async (smartCode) => {
            const response = await fetchBySmartCode(smartCode);
            return response.data;
        },
    });
