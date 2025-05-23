import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from '../api/ProductService';

export const listAllProducts = () =>
    useQuery({
        queryKey: ['products'],
        queryFn: async () => (await getAllProducts()).data,
    });

export const save = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
}

export const update = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
};

export const removeOneProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['products']);
        },
    });
};
