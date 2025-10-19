import { useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { createSector } from '../../shared/hooks/useSectors'
import { updateSector } from '../../shared/hooks/useSectors'
import { useForm } from "../../hooks/useForm";
import { toast } from 'react-toastify';
import FormInput from "../../components/FormInput";
import ActionButton from "../../components/ActionButton";
import ProgressBar from "../../components/ProgressBar";


export default function SectorForm({ onClose, sector = {} }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    const {
        mutate: creation,
        isLoading: isCreating
    } = createSector();
    const { mutateAsync: updating } = updateSector();

    const fieldsConfig = [
        { name: "smartCode", label: t("sector.barcode"), type: "text", icon: "𝄃𝄂𝄀𝄁𝄃𝄂𝄂𝄃" },
        { name: "name", label: t("sector.name"), type: "text", icon: "👤", required: true },
    ];

    const { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
        initialData: { ...sector },
        fieldsConfig,
        onSubmit: async (data) => {
            try {
                if (!sector._id) {
                    await creation(data);
                    toast.success(t("toast.creation.success", { description: data.name }));
                } else {
                    await updating({ id: sector._id, data });
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
            className="space-y-4 bg-white p-6 flex flex-wrap gap-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
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
                bgColor="blue"
                text={isSubmitting ? t("button.saving") : t("button.save")}
                icon={isSubmitting ? "⏳" : "💾"}
                disabled={isSubmitting}
            />
            <ProgressBar value={fieldsFilled || 0} max={2} />
        </form>
    );

}