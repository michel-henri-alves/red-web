import { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { saveCustomer, updateCustomerById } from 'red-shared'
import { toast } from 'react-toastify';
import FormInput from '../../../components/FormInput';

export default function CustomerForm({ onClose, customer }) {
    const { t } = useTranslation();
    const {
        mutate: creation,
        isLoading: isLoadingCreation,
        isSuccess: isSuccessCreation,
        isError: isErrorCreation,
        error: errorCreation,
        reset: resetCreation,
    } = saveCustomer();
    const { mutateAsync: updating } = updateCustomerById();
    const [form, setForm] = useState(customer || {});
    useEffect(() => {
        setForm(customer || {});
    }, [customer]);

    const [isForCreate, setForCreate] = useState(() => {
        if (Object.keys(customer).length === 0) {
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
        if (!form.name) errs.name = t("required.field", { field: t("customer.name"), domain: t("customer") });
        if (!form.phone) errs.phone = t("required.field", { field: t("customer.phone"), domain: t("customer") });
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


    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 flex flex-wrap gap-5 rounded-xl shadow-2xl shadow-[4px_0_6px_rgba(0,0,0,0.25),0_4px_6px_rgba(0,0,0,0.25)]">
            <FormInput
                name="smartCode"
                value={form.smartCode || ''}
                placeholder={t("customer.barcode")}
                onChange={handleChange}
                errors={errors.smartCode}
                icon="𝄃𝄃𝄂𝄂𝄀𝄁"
                inputRef={inputRef}
                type="text" />

            <FormInput
                name="name"
                value={form.name}
                placeholder={t("customer.name")}
                onChange={handleChange}
                errors={errors.name}
                icon="👤"
                type="text" />

            <FormInput
                name="nickname"
                value={form.nickname}
                placeholder={t("customer.nickname")}
                onChange={handleChange}
                errors={errors.nickname}
                icon="👤"
                type="text" />

            <FormInput
                name="phone"
                value={form.phone}
                placeholder={t("customer.phone")}
                onChange={handleChange}
                errors={errors.phone}
                icon="📞"
                type="text" />

            <FormInput
                name="address"
                value={form.address}
                placeholder={t("customer.address")}
                onChange={handleChange}
                errors={errors.address}
                icon="🏠︎"
                type="text" />

            <FormInput
                name="email"
                value={form.email}
                placeholder={t("customer.email")}
                onChange={handleChange}
                errors={errors.email}
                icon="@"
                type="email" />

            <FormInput
                name="birth"
                value={form.birth}
                placeholder={t("customer.birth")}
                onChange={handleChange}
                errors={errors.email}
                icon="🗓️"
                type="text" />


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