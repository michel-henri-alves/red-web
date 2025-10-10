import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
    create,
    update,
    remove,
    fetchPaginated,
} from '../api/CustomerApi';


export const fetchAllCustomersPaginatedAndFilteredByName = (filter, limit = 5) => {
    return useInfiniteQuery({
        queryKey: ['customers-infinite', filter],
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

export const createCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: create,
        onSuccess: () => {
            queryClient.invalidateQueries(['customers']);
        },
    });
}

export const updateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['customers']);
        },
    });
};

export const removeCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: remove,
        onSuccess: () => {
            queryClient.invalidateQueries(['customers']);
        },
    });
};

export const findCustomerBySmartCode = () =>
    useMutation({
        mutationFn: async (smartCode) => {
            const response = await getCustomerBySmartCode(smartCode);
            return response.data;
        },
    });

export const searchCustomersRegexByName = () =>
    useQuery({
        queryKey: ['customers'],
        queryFn: async () => (await getAllCustomersRegexByName()).data,
    });

export const listCustomersByName = (input) =>
    useQuery({
        queryKey: ['customers', 'filter', input],
        queryFn: async () => (await getAllCustomersRegexByName(input)).data,
        enabled: !!input, // only run when input is non-empty
    });

