import { useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import {
    create,
    fetchPaginated,
    update,
    remove
} from '../api/IssueApi';

const invalidateIssues = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['issues'] });
    queryClient.invalidateQueries({ queryKey: ['issues-infinite'] });
};

export const createIssue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: create,
        onSuccess: () => invalidateIssues(queryClient),
    });
};

export const fetchAllIssuesPaginated = (filters, limit = 10) => {
    return useInfiniteQuery({
        queryKey: ['issues-infinite', filters],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchPaginated(filters, pageParam, limit);
            return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        keepPreviousData: true,
    });
};

export const updateIssue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => update(id, data),
        onSuccess: () => invalidateIssues(queryClient),
    });
};

export const removeIssue = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: remove,
        onSuccess: () => invalidateIssues(queryClient),
    });
};
