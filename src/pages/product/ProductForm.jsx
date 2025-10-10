import { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { createProduct, updateProduct } from "../../shared/hooks/useProducts";
import { toast } from 'react-toastify';

import UnitOfMeasurementEnum from '../../enums/unitOfMeasurementEnum';

import FormInput from '../../components/FormInput';


export default function ProductForm({ onClose, product }) {
    const { t } = useTranslation();
    const {
        mutate: creation,
        isLoading: isLoadingCreation,
        isSuccess: isSuccessCreation,
        isError: isErrorCreation,
        error: errorCreation,
        reset: resetCreation,
    } = createProduct();
    const { mutateAsync: updating } = updateProduct();
    const [form, setForm] = useState(product || {});
    useEffect(() => {
        setForm(product || {});
    }, [product]);

    const [isOwnManufacture, setOwnManufacture] = useState(form.ownManufacture);
    const [isForCreate, setForCreate] = useState(() => {
        if (Object.keys(product).length === 0) {
            return true;
        } else {
            return false;
        }
    })
    const [errors, setErrors] = useState({});
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
            setErrors(validationErrors);
            return;
        }

        if (isForCreate) {
            creation(form, {
                onSuccess: () => {
                    setErrors({});
                    if (onClose) onClose();
                    toast.success(t("toast.creation.success", { description: form.name }));
                },
                onError: (error) => {
                    console.error(error);
                    toast.error(t("toast.creation.error", { description: form.name, errorCause: error.response.data.error }));
                },
            });
        } else {
            updating({
                id: form._id,
                data: form,
            }, {
                onSuccess: () => {
                    setErrors({});
                    if (onClose) onClose();
                    toast.success(t("toast.update.success", { description: form.name }));
                },
                onError: (error) => {
                    console.error(error);
                    toast.error(t("toast.update.error", { description: form.name, errorCause: error.response.data.error }));
                },
            });
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
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 flex flex-wrap gap-5 rounded-xl shadow-2xl shadow-[4px_0_6px_rgba(0,0,0,0.25),0_4px_6px_rgba(0,0,0,0.25)]">
            <FormInput
                label={t("product.barcode")}
                name="smartCode"
                value={form.smartCode || ''}
                placeholder={t("product.barcode")}
                onChange={handleChange}
                errors={errors.smartCode}
                icon="𝄃𝄃𝄂𝄂𝄀𝄁"
                inputRef={inputRef}
                type="text" />

            <FormInput
                label={t("product.name")}
                name="name"
                value={form.name}
                placeholder={t("product.name")}
                onChange={handleChange}
                errors={errors.name}
                icon="👤"
                type="text" />

            <FormInput
                label={t("manufacturer")}
                name="manufacturer"
                value={form.manufacturer || ''}
                placeholder={t("manufacturer")}
                onChange={handleChange}
                errors={errors.manufacturer}
                icon="🏭"
                type="text" />

            <FormInput
                label={t("supplier")}
                name="supplier"
                value={form.supplier || ''}
                placeholder={t("supplier")}
                onChange={handleChange}
                errors={errors.supplier}
                icon="🚛"
                type="text" />

            <FormInput
                label={t("product.category")}
                name="category"
                value={form.category || ''}
                placeholder={t("product.category")}
                onChange={handleChange}
                errors={errors.category}
                icon="🏷️"
                type="text" />

            <FormInput
                label={t("product.purchasePrice")}
                name="purchasePrice"
                value={form.purchasePrice || ''}
                placeholder={t("product.purchasePrice")}
                onChange={handleChange}
                errors={errors.purchasePrice}
                icon="💸"
                type="number" />

            <FormInput
                label={t("product.priceForSale")}
                name="priceForSale"
                value={form.priceForSale || ''}
                placeholder={t("product.priceForSale")}
                onChange={handleChange}
                errors={errors.priceForSale}
                icon="💵"
                type="number" />

            <FormInput
                label={t("product.minQuantity")}
                name="minQuantity"
                value={form.minQuantity || ''}
                placeholder={t("product.minQuantity")}
                onChange={handleChange}
                errors={errors.minQuantity}
                icon="📈"
                type="number" />

            <FormInput
                label={t("product.qty.actual")}
                name="actualQuantity"
                value={form.actualQuantity || ''}
                placeholder={t("product.qty.actual")}
                onChange={handleChange}
                errors={errors.actualQuantity}
                icon="📦"
                type="number" />

            <div>
                <label className="text-2xl block font-medium text-gray-700">{t("product.unit.of.measurement")}</label>
                <select className="text-2xl block py-2.5 px-0 w-full text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                    name="unitOfMeasurement"
                    value={form.unitOfMeasurement}
                    onChange={handleChange}>
                    {Object.entries(UnitOfMeasurementEnum).map(([key, value]) => (
                        <option key={key} value={value}>
                            {t(value)}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="inline-flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="ownManufacture"
                        checked={form.ownManufacture}
                        onChange={handleCheckboxChange}
                        className="text-2xl w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500  cursor-pointer"
                    />
                    <span className="text-2xl text-gray-900">{t("product.ownManufacture")}</span>
                </label>
            </div>

            <button
                type="submit"
                disabled={isLoadingCreation}
                className="text-2xl font-bold w-full bg-blue-600 text-white py-2 px-4 rounded 
                hover:bg-blue-700 active:bg-blue-200 transition cursor-pointer"
            >
                💾 {t("button.save")}
            </button>

        </form>
    );

}