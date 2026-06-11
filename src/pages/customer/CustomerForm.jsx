import { useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { createCustomer, updateCustomer } from '../../shared/hooks/useCustomers'
import { toast } from 'react-toastify';
import { useForm } from "../../hooks/useForm";
import FormInput from '../../components/FormInput';
import ActionButton from "../../components/ActionButton";
import ProgressBar from "../../components/ProgressBar";
import { formatApiErrorCause } from "../../shared/utils/apiErrorFormatter";
import {
 ScanBarcode,
 User,
 Phone,
 MapPinHouse,
 AtSign,
 Cake,
 Hourglass,
 Save,
 Building2,
 Hash,
 Globe,
 Mail
} from "lucide-react";


const CUSTOMER_TYPE_PF = "PF";
const CUSTOMER_TYPE_PJ = "PJ";

const getCustomerType = (customer = {}) => (
    customer.customerType || customer.type || (customer.cnpj || customer.contact ? CUSTOMER_TYPE_PJ : CUSTOMER_TYPE_PF)
);

const getInitialCustomerData = (customer = {}) => ({
    ...customer,
    customerType: getCustomerType(customer),
    contactName: customer.contact?.name || customer.contactName || "",
    contactPhone: customer.contact?.phone || customer.contactPhone || "",
    contactEmail: customer.contact?.email || customer.contactEmail || "",
});

const buildCustomerPayload = (data, customerType) => {
    const {
        contactName,
        contactPhone,
        contactEmail,
        type,
        contact,
        ...payload
    } = data;

    payload.customerType = customerType;

    if (customerType === CUSTOMER_TYPE_PJ) {
        const contactPayload = {
            name: contactName,
            phone: contactPhone,
            email: contactEmail,
        };
        if (Object.values(contactPayload).some(Boolean)) {
            payload.contact = contactPayload;
        }
    } else {
        delete payload.cnpj;
        delete payload.cep;
        delete payload.phone2;
        delete payload.website;
        delete payload.fantasyName;
        delete payload.contact;
    }

    return payload;
};


export default function CustomerForm({ onClose, customer = {} }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const customerType = getCustomerType(customer);

    const {
        mutateAsync: creation,
        isLoading: isCreating
    } = createCustomer();
    const { mutateAsync: updating } = updateCustomer();

    const pfFieldsConfig = [
        { name: "smartCode", label: t("customer.barcode"), type: "text", icon: ScanBarcode, maxLength: 50 },
        { name: "name", label: t("customer.name"), type: "text", icon: User, required: true, maxLength: 80 },
        { name: "nickname", label: t("customer.nickname"), type: "text", icon: User, maxLength: 100 },
        { name: "phone", label: t("customer.phone"), type: "text", icon: Phone, required: true, maxLength: 11 },
        { name: "address", label: t("customer.address"), type: "text", icon: MapPinHouse, required: true, maxLength: 200 },
        { name: "email", label: t("customer.email"), type: "text", icon: AtSign, maxLength: 60 },
        { name: "birth", label: t("customer.birth"), type: "date", icon: Cake },
    ];

    const pjEnterpriseFieldsConfig = [
        { name: "smartCode", label: t("customer.smartCode"), type: "text", icon: ScanBarcode, maxLength: 50 },
        { name: "name", label: t("customer.name"), type: "text", icon: Building2, required: true, maxLength: 80 },
        { name: "fantasyName", label: t("customer.fantasyName"), type: "text", icon: Building2, maxLength: 100 },
        { name: "cnpj", label: t("customer.cnpj"), type: "text", icon: Hash, required: true, maxLength: 14 },
        { name: "address", label: t("customer.address"), type: "text", icon: MapPinHouse, required: true, maxLength: 200 },
        { name: "cep", label: t("customer.cep"), type: "text", icon: MapPinHouse, required: true, maxLength: 8 },
        { name: "phone", label: t("customer.phone1"), type: "text", icon: Phone, required: true, maxLength: 11 },
        { name: "phone2", label: t("customer.phone2"), type: "text", icon: Phone, maxLength: 11 },
        { name: "website", label: t("customer.website"), type: "text", icon: Globe, maxLength: 120 },
        { name: "email", label: t("customer.email"), type: "email", icon: Mail, required: true, maxLength: 60 },
    ];

    const pjContactFieldsConfig = [
        { name: "contactName", label: t("customer.contact.name"), type: "text", icon: User, maxLength: 80 },
        { name: "contactPhone", label: t("customer.contact.phone"), type: "text", icon: Phone, maxLength: 11 },
        { name: "contactEmail", label: t("customer.contact.email"), type: "email", icon: Mail, maxLength: 60 },
    ];

    const pjFieldsConfig = [...pjEnterpriseFieldsConfig, ...pjContactFieldsConfig];
    const fieldsConfig = customerType === CUSTOMER_TYPE_PJ ? pjFieldsConfig : pfFieldsConfig;

    const { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
        initialData: getInitialCustomerData(customer),
        fieldsConfig,
        onSubmit: async (data) => {
            const payload = buildCustomerPayload(data, customerType);
            try {
                if (!customer._id) {
                    await creation(payload);
                    toast.success(t("toast.creation.success", { description: payload.name }));
                } else {
                    await updating({ id: customer._id, data: payload });
                    toast.success(t("toast.update.success", { description: payload.name }));
                }
                onClose?.();
            } catch (err) {
                toast.error(t(customer._id ? "toast.update.error" : "toast.creation.error", {
                    description: payload.name,
                    errorCause: formatApiErrorCause(err, t)
                }));
            }
        },
    });

    useEffect(() => inputRef.current?.focus(), []);
    const fieldsFilled = Object.values(form).filter(Boolean).length;
    const renderField = (field, idx) => (
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
    );

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-200 p-6 flex flex-wrap gap-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
        >
            <div className="w-full rounded-lg bg-white px-4 py-3 text-lg font-semibold text-gray-700">
                {t("customer.type")}: {t(customerType === CUSTOMER_TYPE_PJ ? "customer.type.pj" : "customer.type.pf")}
            </div>

            {customerType === CUSTOMER_TYPE_PJ ? (
                <>
                    <section className="w-full space-y-4">
                        <h2 className="border-b border-gray-300 pb-2 text-base font-semibold text-gray-700">
                            {t("customer.company.section")}
                        </h2>
                        {pjEnterpriseFieldsConfig.map(renderField)}
                    </section>
                    <section className="w-full space-y-4 pt-2">
                        <h2 className="border-b border-gray-300 pb-2 text-base font-semibold text-gray-700">
                            {t("customer.contact.section")}
                        </h2>
                        {pjContactFieldsConfig.map((field, idx) => renderField(field, pjEnterpriseFieldsConfig.length + idx))}
                    </section>
                </>
            ) : (
                fieldsConfig.map(renderField)
            )}

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
