import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/products',
});

export const getAllProducts = () => API.get('/');
export const getAllProductsRegexByName = (input) => API.get(`/search/${input}`);
export const createProduct = (data) => API.post('/', data);
export const updateProduct = (id, data) => API.put(`/${id}`, data);
export const deleteProduct = (id) => API.delete(`/${id}`);
export const getPaginatedProducts = (page, limit = 10) => API.get(`?page=${page}&limit=${limit}`);