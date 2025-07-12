import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { save, updateProductById } from 'red-shared'
import { toast } from 'react-toastify';

export default function ProductForm({ onClose, product }) {
    const { t } = useTranslation();
    const { mutate: create } = save();
    const { mutateAsync: updating } = updateProductById();
    const [form, setForm] = useState(product);
    const [isOwnManufacture, setOwnManufacture] = useState(form.ownManufacture);
    const [isForCreate, setForCreate] = useState(() => {
        if (Object.keys(product).length === 0) {
            return true;
        } else {
            return false;
        }
    })
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);

    const inputRef = useRef(null);
    useEffect(() => {
        if (onClose) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [onClose]);

    const validate = () => {
        const errs = {};
        if (!form.name) errs.name = t("required.field", { field: t("product.name"), domain: t("product") });
        if (!form.priceForSale) errs.priceForSale = t("required.field", { field: t("product.priceForSale"), domain: t("product") });
        return errs;
    };

    const handleChange = (e) => {
        e.preventDefault();
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            alert(Object.keys(validationErrors)[1])
            setErrors(validationErrors);
            return;
        }

        try {
            if (isForCreate) {
                alert(JSON.stringify(form));
                create(form);
                setErrors({});
                toast.success(t("toast.creation.success", { description: form.name }));
            } else {
                JSON.stringify(form)
                await updating({
                    id: form._id,
                    data: form
                });
                setErrors({});
                toast.success(t("toast.update.success", { description: form.name }));

            }
            if (onClose) onClose();

        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, type, value, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">{t("product.barcode")}</label>
                <input
                    ref={inputRef}
                    name="smartCode"
                    value={form.smartCode}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                />
                {errors.smartCode && <p className="text-red-500 text-sm">{errors.smartCode}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{t("product.name")}</label>
                <textarea
                    name="name"
                    rows="2"
                    value={form.name}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{t("manufacturer")}</label>
                <input
                    name="manufacturer"
                    value={form.manufacturer}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                />
                {errors.manufacturer && <p className="text-red-500 text-sm">{errors.manufacturer}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{t("supplier")}</label>
                <input
                    name="supplier"
                    value={form.supplier}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                />
                {errors.supplier && <p className="text-red-500 text-sm">{errors.supplier}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{t("product.category")}</label>
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                />
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{t("product.purchasePrice")}</label>
                <input
                    name="purchasePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.purchasePrice}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                />
                {errors.purchasePrice && <p className="text-red-500 text-sm">{errors.purchasePrice}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{t("product.priceForSale")}</label>
                <input
                    name="priceForSale"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.priceForSale}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                />
                {errors.priceForSale && <p className="text-red-500 text-sm">{errors.priceForSale}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{t("product.minQuantity")}</label>
                <input
                    name="minQuantity"
                    type="number"
                    min="0"
                    value={form.minQuantity}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                />
                {errors.minQuantity && <p className="text-red-500 text-sm">{errors.minQuantity}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{t("product.actualQuantity")}</label>
                <input
                    name="actualQuantity"
                    type="number"
                    min="0"
                    value={form.actualQuantity}
                    onChange={handleChange}
                    class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                />
                {errors.actualQuantity && <p className="text-red-500 text-sm">{errors.actualQuantity}</p>}
            </div>

            <div>
                <label class="inline-flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="ownManufacture"
                        checked={form.ownManufacture}
                        onChange={handleCheckboxChange}
                        class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500  cursor-pointer"
                    />
                    <span class="text-sm text-gray-900">{t("product.ownManufacture")}</span>
                </label>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded 
                hover:bg-blue-700 active:bg-blue-200 transition cursor-pointer"
            >
                {t("button.save")}
            </button>

        </form>
    );

}