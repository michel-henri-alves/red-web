import { useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { createSector } from '../../shared/hooks/useSectors'
import { updateSector } from '../../shared/hooks/useSectors'
import { useForm } from "../../hooks/useForm";
import { toast } from 'react-toastify';
import FormInput from "../../components/FormInput";
import ActionButton from "../../components/ActionButton";
import ProgressBar from "../../components/ProgressBar";
import { formatApiErrorCause } from "../../shared/utils/apiErrorFormatter";
import {
 ScanBarcode,
 User,
 Hourglass,
 Save,
 MapPinHouse,
 Phone,
 Mail,
 Building2
} from "lucide-react";

const onlyDigits = (value = "") => String(value).replace(/\D/g, "");

const formatCep = (value = "") => onlyDigits(value)
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");

const getInitialSectorData = (sector = {}) => ({
    ...sector,
    cep: sector.cep ? formatCep(sector.cep) : "",
    contactName: sector.contact?.name || sector.contactName || "",
    contactPhone: sector.contact?.phone || sector.contactPhone || "",
    contactEmail: sector.contact?.email || sector.contactEmail || "",
});

const removeEmptyOptionals = (payload, optionalFields) => {
    optionalFields.forEach((field) => {
        if (payload[field] === "" || payload[field] === null || payload[field] === undefined) {
            delete payload[field];
        }
    });
};

const buildSectorPayload = (data, includeEmptyOptionals = false) => {
    const {
        contactName,
        contactPhone,
        contactEmail,
        contact,
        ...payload
    } = data;

    payload.cep = onlyDigits(payload.cep);

    const contactPayload = {
        name: contactName || "",
        phone: contactPhone || "",
        email: contactEmail || "",
    };

    if (Object.values(contactPayload).some(Boolean) || (includeEmptyOptionals && contact)) {
        payload.contact = contactPayload;
    }

    if (!includeEmptyOptionals) {
        removeEmptyOptionals(payload, ["type", "address", "cep"]);
        if (payload.contact && !Object.values(payload.contact).some(Boolean)) {
            delete payload.contact;
        }
    }

    return payload;
};

export default function SectorForm({ onClose, sector = {} }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    const {
        mutateAsync: creation,
        isLoading: isCreating
    } = createSector();
    const { mutateAsync: updating } = updateSector();

    const fieldsConfig = [
        { name: "smartCode", label: t("sector.barcode"), type: "text", icon: ScanBarcode },
        { name: "name", label: t("sector.name"), type: "text", icon: User, required: true },
    ];

    const additionalFieldsConfig = [
        { name: "type", label: t("sector.type"), type: "text", icon: Building2, maxLength: 80 },
        { name: "address", label: t("sector.address"), type: "text", icon: MapPinHouse, maxLength: 200 },
        { name: "cep", label: t("sector.cep"), type: "text", icon: MapPinHouse, minLength: 9, maxLength: 9 },
        { name: "contactName", label: t("sector.contact.name"), type: "text", icon: User, maxLength: 80 },
        { name: "contactPhone", label: t("sector.contact.phone"), type: "text", icon: Phone, maxLength: 20 },
        { name: "contactEmail", label: t("sector.contact.email"), type: "email", icon: Mail, maxLength: 60 },
    ];

    const allFieldsConfig = [...fieldsConfig, ...additionalFieldsConfig];

    const { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
        initialData: getInitialSectorData(sector),
        fieldsConfig: allFieldsConfig,
        onSubmit: async (data) => {
            const payload = buildSectorPayload(data, Boolean(sector._id));
            try {
                if (!sector._id) {
                    await creation(payload);
                    toast.success(t("toast.creation.success", { description: payload.name }));
                } else {
                    await updating({ id: sector._id, data: payload });
                    toast.success(t("toast.update.success", { description: payload.name }));
                }
                onClose?.();
            } catch (err) {
                toast.error(t(sector._id ? "toast.update.error" : "toast.creation.error", {
                    description: payload.name,
                    errorCause: formatApiErrorCause(err, t)
                }));
            }
        },
    });

    useEffect(() => inputRef.current?.focus(), []);
    const fieldsFilled = Object.values(form).filter(Boolean).length;
    const handleFieldChange = (event) => {
        if (event.target.name !== "cep") {
            handleChange(event);
            return;
        }

        handleChange({
            ...event,
            target: {
                name: event.target.name,
                type: event.target.type,
                checked: event.target.checked,
                value: formatCep(event.target.value),
            },
        });
    };

    const renderField = (field, idx) => (
        <FormInput
            key={field.name}
            label={field.label}
            name={field.name}
            value={form[field.name] || ""}
            placeholder={field.label}
            onChange={handleFieldChange}
            onBlur={handleBlur}
            errors={touched[field.name] && errors[field.name]}
            icon={field.icon}
            inputRef={idx === 0 ? inputRef : null}
            type={field.type}
            max={field.max}
            maxLength={field.maxLength}
        />
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-200 p-6 flex flex-wrap gap-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
        >
            {fieldsConfig.map(renderField)}

            <details className="w-full rounded-lg bg-white p-4 shadow-md">
                <summary className="cursor-pointer text-lg font-semibold text-gray-700">
                    {t("sector.additionalData")}
                </summary>
                <div className="mt-4 space-y-4">
                    {additionalFieldsConfig.map((field, idx) => renderField(field, fieldsConfig.length + idx))}
                </div>
            </details>

            <ActionButton
                type="submit"
                bgColor="[rgba(98,70,234)]"
                text={isSubmitting ? t("button.saving") : t("button.save")}
                icon={isSubmitting ? Hourglass : Save}
                disabled={isSubmitting}
            />
            <ProgressBar value={fieldsFilled || 0} max={allFieldsConfig.length} />
        </form>
    );

}
