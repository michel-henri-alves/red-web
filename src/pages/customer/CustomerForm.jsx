import { useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { createCustomer, updateCustomer } from '../../shared/hooks/useCustomers'
import { toast } from 'react-toastify';
import { useForm } from "../../hooks/useForm";
import FormInput from '../../components/FormInput';
import ActionButton from "../../components/ActionButton";
import ProgressBar from "../../components/ProgressBar";
import {
 ScanBarcode,
 User,
 Phone,
 MapPinHouse,
 AtSign,
 Cake,
 Hourglass,
 Save
} from "lucide-react";


export default function CustomerForm({ onClose, customer = {} }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    const {
        mutateAsync: creation,
        isLoading: isCreating
    } = createCustomer();
    const { mutateAsync: updating } = updateCustomer();

    const fieldsConfig = [
        { name: "smartCode", label: t("customer.barcode"), type: "text", icon: ScanBarcode },
        { name: "name", label: t("customer.name"), type: "text", icon: User, required: true },
        { name: "nickname", label: t("customer.nickname"), type: "text", icon: User },
        { name: "phone", label: t("customer.phone"), type: "text", icon: Phone, required: true },
        { name: "address", label: t("customer.address"), type: "text", icon: MapPinHouse, required: true },
        { name: "email", label: t("customer.email"), type: "text", icon: AtSign },
        { name: "birth", label: t("customer.birth"), type: "date", icon: Cake },
    ];

    const { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
        initialData: { ...customer },
        fieldsConfig,
        onSubmit: async (data) => {
            try {
                if (!customer._id) {
                    console.log(customer)
                    await creation(data);
                    toast.success(t("toast.creation.success", { description: data.name }));
                } else {
                    await updating({ id: customer._id, data });
                    toast.success(t("toast.update.success", { description: data.name }));
                }
                onClose?.();
            } catch (err) {
                toast.error(t("toast.creation.error", {
                    description: data.name,
                    errorCause: err.response?.data?.error
                }));
            }
        },
    });

    useEffect(() => inputRef.current?.focus(), []);
    const fieldsFilled = Object.values(form).filter(Boolean).length;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-200 p-6 flex flex-wrap gap-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
        >

            {fieldsConfig.map((field, idx) => (
                <FormInput
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={form[field.name] || ""}
                    placeholder={field.label}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={touched[field.name] && errors[field.name]}
                    icon={field.icon}
                    inputRef={idx === 0 ? inputRef : null}
                    type={field.type}
                    max={field.max}
                />
            ))}

            <ActionButton
                type="submit"
                bgColor="[rgba(98,70,234)]"
                text={isSubmitting ? t("button.saving") : t("button.save")}
                icon={isSubmitting ? Hourglass : Save}
                disabled={isSubmitting}
            />
            <ProgressBar value={fieldsFilled || 0} max={7} />

        </form>
    );

}