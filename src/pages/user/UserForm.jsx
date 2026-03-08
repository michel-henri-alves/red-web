import { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { createUser, updateUser } from '../../shared/hooks/useUsers'
import { toast } from 'react-toastify';
import { useForm } from "../../hooks/useForm";
import FormInput from '../../components/FormInput';
import ActionButton from "../../components/ActionButton";
import ProgressBar from "../../components/ProgressBar";
import OptionsRange from "../../components/OptionsRange";
import {
 User,
 AtSign,
 Hourglass,
 Save,
 IdCard,
 KeyRound,
 Hammer,
 BriefcaseBusiness
} from "lucide-react";


export default function UserForm({ onClose, user = {} }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    const {
        mutateAsync: creation,
        isLoading: isCreating
    } = createUser();
    const { mutateAsync: updating } = updateUser();

    const [selected, setSelected] = useState(user?.role || "user");
    const options = [
        { label: t("admin"), value: "admin", colorClass: "bg-yellow-500", icon: BriefcaseBusiness },
        { label: t("user"), value: "user", colorClass: "bg-green-500", icon: Hammer },
    ];

    const fieldsConfig = [
        { name: "name", label: t("user.name"), type: "text", icon: User, required: true },
        { name: "username", label: t("user.username"), type: "text", icon: IdCard },
        { name: "email", label: t("user.email"), type: "text", icon: AtSign },
    ];

    const { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
        initialData: { ...user },
        fieldsConfig,
        onSubmit: async (data) => {
            try {
                if (!user._id) {
                    console.log(user)
                    await creation(data);
                    toast.success(t("toast.creation.success", { description: data.name }));
                } else {
                    await updating({ id: user._id, data });
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

            <div className="w-full">
                <span className="flex text-lg text-gray-900"><KeyRound size={30} className="pr-2" /> {t("user.role")}</span>
                <OptionsRange options={options} selected={selected} setSelected={setSelected} />
            </div>

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