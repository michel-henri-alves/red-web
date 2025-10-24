import { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useCreatePendings, useUpdatePendings } from '../../../shared/hooks/usePendings'
import { toast } from 'react-toastify';
import { useForm } from "../../../hooks/useForm";
import FormInput from '../../../components/FormInput';
import ActionButton from "../../../components/ActionButton";
import ProgressBar from "../../../components/ProgressBar";
import OptionsRange from "../../../components/OptionsRange";
import {
    Banknote,
    BanknoteArrowDown,
    BanknoteArrowUp,
    Hourglass,
    Save,
} from "lucide-react";
import MoneyInput from '../../../components/MoneyInput';


export default function BookletForm({ onClose, pending = {}, customerId }) {
    console.log(customerId)
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const {
        mutateAsync: creation,
        isLoading: isCreating,
    } = useCreatePendings();
    const { mutateAsync: updating } = useUpdatePendings();
    const fieldsConfig = [
        { name: "amount", label: t("pending.amount"), type: "number", icon: Banknote, required: true, component: MoneyInput },
    ];
    const [selected, setSelected] = useState(pending?.pendingType || "DEBIT");
    const options = [
        { label: t("DEBIT"), value: "DEBIT", colorClass: "bg-red-500", icon: BanknoteArrowDown },
        { label: t("CREDIT"), value: "CREDIT", colorClass: "bg-green-500", icon: BanknoteArrowUp },
    ];

    const { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
        initialData: {
            ...pending,
            pendingType: pending?.pendingType || "DEBIT",
            customerId: pending.customerId
        },
        fieldsConfig,
        onSubmit: async (data) => {
            try {
                if (!pending._id) {
                    const creationPayload = {
                        ...data,
                        customerId: customerId.customerId,
                        pendingType: selected
                    };
                    await creation(creationPayload);
                    toast.success(t("toast.creation.success", { description: t(data.pendingType) + " " + t("currency") + data.amount }));
                } else {
                    const updatingPayload = {
                        ...data,
                        customerId: pending.customerId,
                        pendingType: selected,
                        amount: Number(data.amount)
                    };
                    console.log(updatingPayload)
                    await updating({ id: pending._id, data: updatingPayload });
                    toast.success(t("toast.update.success", { description: t(data.pendingType) + " " + t("currency") + data.amount }));
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
    const requiredFields = ["amount"];
    const fieldsFilled = Object.entries(form)
        .filter(([key, value]) => requiredFields.includes(key) && Boolean(value))
        .length;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 flex flex-wrap gap-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
        >
            {fieldsConfig.map((field, idx) => {
                const InputComponent = field.component || FormInput;

                return (
                    <InputComponent
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
                );
            })}

            <div className="w-full">
                {/* <label className="text-2xl block font-medium text-gray-700">{t("pending")}</label>
                <select
                    className="w-full text-lg py-2 px-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 hover:shadow-md transition-all duration-300"
                    name="pendingType"
                    value={form.pendingType || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    {Object.entries(PendingTypeEnum).map(([key, value]) => (
                        <option key={key} value={value}>
                            {t(value)}
                        </option>
                    ))}
                </select> */}
                <span className="flex text-lg text-gray-900">{t("pending")}</span>
                <OptionsRange options={options} selected={selected} setSelected={setSelected} />
            </div>


            <ActionButton
                type="submit"
                bgColor="[rgba(98,70,234)]"
                text={isSubmitting ? t("button.saving") : t("button.save")}
                icon={isSubmitting ? Hourglass : Save}
                disabled={isSubmitting}
            />
            <ProgressBar value={fieldsFilled || 0} max={requiredFields.length} />


        </form>
    );

}