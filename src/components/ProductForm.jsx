import React, { useState } from 'react';
import axios from 'axios';
import { createProduct } from '../api/ProductService';

export default function ProductForm( {onClose} ) {

    const [form, setForm] = useState({
        product_name: '', 
        price: '',
        responsible: ''
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);

    const validate = () => {
        const errs = {};
        if (!form.product_name) errs.product_name = 'Name is required';
        if (!form.price) errs.price = 'Price is required';
        // if (!form.description) errs.description = 'Description is required';
        return errs;
    };

    const handleChange = (e) => {
        e.preventDefault();
        setForm({ ...form, [e.target.name]: e.target.value });
        if (onClose) onClose(); // fecha o modal se função passada
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            console.log("dados para o post: ", form)
            await createProduct(form); // ajuste para sua rota real
            setStatus('success'); 
            setForm({ 
                name: '', 
                price: ''
            });
            setErrors({});
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                    name="product_name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                    name="responsible"
                    value={form.responsible}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                Save Product
            </button>

            {status === 'success' && (
                <p className="text-green-600 text-sm">Product saved successfully!</p>
            )}
            {status === 'error' && (
                <p className="text-red-600 text-sm">Failed to save product. Try again.</p>
            )}
        </form>
    );

}