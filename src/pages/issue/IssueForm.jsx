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
 Save,
 Wrench
} from "lucide-react";

const RISK_OPTIONS = ["INFO", "WARN", "ERROR"];
const ISSUE_STATUS_OPTIONS = ["OPEN", "DOING", "TREATED"];

function IssueSelectInput({ label, name, value, onChange, onBlur, errors, icon: Icon, inputRef, options }) {
    return (
        <div className="w-full relative">
            <label className="flex items-center space-x-2 text-lg font-medium text-gray-700 mb-1" htmlFor={name}>
                <Icon size={30} />
                <span>{label}</span>
            </label>

            <select
                id={name}
                ref={inputRef}
                name={name}
                value={value ?? ""}
                onChange={onChange}
                onBlur={onBlur}
                className={`
                    bg-white w-full py-3 px-4 text-lg rounded-xl border-2
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500
                    focus:shadow-lg focus:shadow-blue-500/50
                    shadow-md hover:shadow-lg transition-shadow
                    transition-all duration-200
                    ${errors ? "border-red-500 animate-shake shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 focus:shadow-lg focus:shadow-red-500/50"
                    : "border-gray-300"}`}
                aria-invalid={!!errors}
                aria-describedby={`${name}-error`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {errors && (
                <p id={`${name}-error`} className="text-red-500 text-sm mt-1 absolute left-0 animate-fade-in">
                    {errors}
                </p>
            )}
        </div>
    );
}

export default function IssueForm({ onClose, issue = {} }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    const { mutateAsync: creation } = createIssue();
    const { mutateAsync: updating } = updateIssue();

    const fieldsConfig = [
        // { name: "workflow", label: t("issue.workflow"), type: "text", icon: GitBranch, required: true, maxLength: 100 },
        // { name: "details", label: t("issue.details"), type: "text", icon: FileText, required: true, maxLength: 500 },
        {
            name: "risk",
            label: t("issue.risk"),
            type: "select",
            icon: ShieldAlert,
            options: RISK_OPTIONS.map((value) => ({ value, label: t(value) }))
        },
        ...(issue?._id ? [{
            name: "status",
            label: t("issue.status"),
            type: "select",
            icon: BadgeCheck,
            options: ISSUE_STATUS_OPTIONS.map((value) => ({ value, label: t(value) }))
        }] : []),
        { name: "sponsor", label: t("issue.sponsor"), type: "text", icon: Handshake, maxLength: 100 },
        { name: "action", label: t("issue.action"), type: "text", icon: Wrench, maxLength: 500 },
        // { name: "metadata", label: t("issue.metadata"), type: "text", icon: Database, maxLength: 500 },
    ];

    const initialData = {
        ...issue,
        risk: issue?.risk || "WARN",
        ...(issue?._id ? { status: issue?.status || "OPEN" } : {}),
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
            {fieldsConfig.map((field, idx) => {
                const InputComponent = field.type === "select" ? IssueSelectInput : FormInput;

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
                        maxLength={field.maxLength}
                        options={field.options}
                    />
                );
            })}

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
