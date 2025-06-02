import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProductsRegexByName,
    getPaginatedProducts,
} from '../api/ProductService';

export const listAllProducts = () =>
    useQuery({
        queryKey: ['products'],
        queryFn: async () => (await getAllProducts()).data,
    });

export const listAllProductsPaginated = (page, limit = 5) =>
    useQuery({
        queryKey: ['products', page, limit],
        queryFn: async () => (await getPaginatedProducts(page, limit)).data,
        keepPreviousData: true,
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

export const updateProductById = () => {
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

export const searchProductsRegexByName = () =>
    useQuery({
        queryKey: ['products'],
        queryFn: async () => (await getAllProductsRegexByName()).data,
    });

    export const listProductsByName = (input) =>
        useQuery({
          queryKey: ['products', 'filter', input],
          queryFn: async () => (await getAllProductsRegexByName(input)).data,
          enabled: !!input, // only run when input is non-empty
        });
      
