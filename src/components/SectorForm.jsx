import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { saveSector, updateSectorById } from 'red-shared'
import { toast } from 'react-toastify';
import UnitOfMeasurementEnum from '../enums/unitOfMeasurementEnum';


export default function SectorForm({ onClose, sector }) {
    const { t } = useTranslation();
    const {
        mutate: creation,
        isLoading: isLoadingCreation,
        isSuccess: isSuccessCreation,
        isError: isErrorCreation,
        error: errorCreation,
        reset: resetCreation,
    } = saveSector();
    const { mutateAsync: updating } = updateSectorById();
    const [form, setForm] = useState(sector);
    const [isOwnManufacture, setOwnManufacture] = useState(form.ownManufacture);
    const [isForCreate, setForCreate] = useState(() => {
        if (Object.keys(sector).length === 0) {
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
        if (!form.name) errs.name = t("required.field", { field: t("sector.name"), domain: t("sector") });
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
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">{t("sector.barcode")}</label>
                <input
                    ref={inputRef}
                    name="smartCode"
                    value={form.smartCode}
                    onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"
                />
                {errors.smartCode && <p className="text-red-500 text-sm">{errors.smartCode}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">{t("sector.name")}</label>
                <textarea
                    name="name"
                    rows="2"
                    value={form.name}
                    onChange={handleChange}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 focus:shadow-[0_2px_4px_-1px_rgba(59,113,202,0.5)] peer"/>
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <button
                type="submit"
                disabled={isLoadingCreation}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded 
                hover:bg-blue-700 active:bg-blue-200 transition cursor-pointer"
            >
                {t("button.save")}
            </button>

        </form>
    );

}