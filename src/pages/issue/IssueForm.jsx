import { useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { createIssue, updateIssue } from '../../shared/hooks/useIssues';
import { useForm } from "../../hooks/useForm";
import { toast } from 'react-toastify';
import FormInput from "../../components/FormInput";
import ActionButton from "../../components/ActionButton";
import ProgressBar from "../../components/ProgressBar";
import { formatApiErrorCause } from "../../shared/utils/apiErrorFormatter";
import { formatIssueMetadataForInput } from "./issueMetadataFormatter";
import {
 GitBranch,
 FileText,
 ShieldAlert,
 Handshake,
 Database,
 BadgeCheck,
 Hourglass,
 Save
} from "lucide-react";

export default function IssueForm({ onClose, issue = {} }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    const { mutateAsync: creation } = createIssue();
    const { mutateAsync: updating } = updateIssue();

    const fieldsConfig = [
        { name: "workflow", label: t("issue.workflow"), type: "text", icon: GitBranch, required: true, maxLength: 100 },
        { name: "details", label: t("issue.details"), type: "text", icon: FileText, required: true, maxLength: 500 },
        { name: "risk", label: t("issue.risk"), type: "text", icon: ShieldAlert, maxLength: 100 },
        ...(issue?._id ? [{ name: "status", label: t("issue.status"), type: "text", icon: BadgeCheck, maxLength: 100 }] : []),
        { name: "sponsor", label: t("issue.sponsor"), type: "text", icon: Handshake, maxLength: 100 },
        { name: "metadata", label: t("issue.metadata"), type: "text", icon: Database, maxLength: 500 },
    ];

    const initialData = {
        ...issue,
        metadata: formatIssueMetadataForInput(issue?.metadata),
    };

    const { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
        initialData,
        fieldsConfig,
        onSubmit: async (data) => {
            const description = data.internalId || data.workflow || t("issue");

            try {
                if (!issue?._id) {
                    await creation(data);
                    toast.success(t("toast.creation.success", { description }));
                } else {
                    await updating({ id: issue._id, data });
                    toast.success(t("toast.update.success", { description }));
                }
                onClose?.();
            } catch (err) {
                const toastKey = issue?._id ? "toast.update.error" : "toast.creation.error";
                toast.error(t(toastKey, {
                    description,
                    errorCause: formatApiErrorCause(err, t)
                }));
            }
        },
    });

    useEffect(() => inputRef.current?.focus(), []);
    const fieldsFilled = fieldsConfig.filter((field) => form[field.name]).length;

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
                    maxLength={field.maxLength}
                />
            ))}

            <ActionButton
                type="submit"
                bgColor="[rgba(98,70,234)]"
                text={isSubmitting ? t("button.saving") : t("button.save")}
                icon={isSubmitting ? Hourglass : Save}
                disabled={isSubmitting}
            />
            <ProgressBar value={fieldsFilled || 0} max={fieldsConfig.length} />
        </form>
    );
}
