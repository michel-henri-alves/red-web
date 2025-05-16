import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../api/ProductService';

export const useProducts = () =>
    useQuery({
        queryKey: ['products'],
        queryFn: async () => (await getAllProducts()).data,
    });
