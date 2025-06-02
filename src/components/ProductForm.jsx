import React, { useState } from 'react';
import { save } from '../hooks/useProducts'
import { updateProductById } from '../hooks/useProducts'
import { toast } from 'react-toastify';

export default function ProductForm({ onClose, product }) {



    const { mutate: create } = save();
    const { mutateAsync: updating } = updateProductById();


    const [form, setForm] = useState(product);
    // const [form, setForm] = useState({
    //     product_name: '',
    //     price: '',
    //     responsible: ''
    // });
    const [forCreate, isForCreate] = useState(() => {
        if (Object.keys(product).length === 0) {
            alert(true)
            return true;
        } else {
            alert(false)
            return false;
        }
    })
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
        //e.preventDefault();
        setForm({ ...form, [e.target.name]: e.target.value });
        //if (onClose) onClose(); // fecha o modal se função passada
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            alert(forCreate)
            if (forCreate) {
                alert("dados para o post: ", form)
                create(form);
                setErrors({});
                toast.success("Produto " + form.product_name + " salvo com sucesso!");
            } else {
                alert("dados para o put: " + JSON.stringify(form))
                JSON.stringify(form)
                await updating({
                    id: form._id,
                    data: form
                });
                setErrors({});
                toast.success("Produto " + form.product_name + " atualizado com sucesso!");

            }
            if (onClose) onClose();

        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">Código de barras</label>
                <input
                    name="smart_code"
                    value={form.smart_code}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.smart_code}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nome do produto</label>
                <input
                    name="product_name"
                    value={form.product_name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.product_name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Fabricante</label>
                <input
                    name="manufacturer"
                    value={form.manufacturer}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.manufacturer}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
                <input
                    name="supplier"
                    value={form.supplier}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.supplier}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Preço</label>
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
                <label className="block text-sm font-medium text-gray-700">Quantidade máxima</label>
                <input
                    name="max_quantity"
                    type="number"
                    value={form.max_quantity}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.max_quantity}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Quantidade minima</label>
                <input
                    name="min_quantity"
                    type="number"
                    value={form.min_quantity}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.price && <p className="text-red-500 text-sm">{errors.min_quantity}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Responsável</label>
                <input
                    name="responsible"
                    value={form.responsible}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.responsible}</p>}
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