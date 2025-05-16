import axios from 'axios';

const API_URL = 'http://localhost:3001/products';

export const getAllProducts = () => axios.get(API_URL);
export const createProduct = (data) => axios.post(API_URL, data);
export const updateProduct = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/${id}`);