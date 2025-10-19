import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createProduct, updateProduct } from "../../shared/hooks/useProducts";
import { toast } from "react-toastify";
import { useForm } from "../../hooks/useForm";
import FormInput from "../../components/FormInput";
import ActionButton from "../../components/ActionButton";
import UnitOfMeasurementEnum from "../../enums/unitOfMeasurementEnum";
import ProgressBar from "../../components/ProgressBar";


export default function ProductForm({ onClose, product = {} }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);

    const {
        mutateAsync: creation,
        isLoading: isCreating
    } = createProduct();
    const { mutateAsync: updating } = updateProduct();

    const fieldsConfig = [
        { name: "smartCode", label: t("product.barcode"), type: "text", icon: "𝄃𝄂𝄀𝄁𝄃𝄂𝄂𝄃" },
        { name: "name", label: t("product.name"), type: "text", icon: "👤", required: true },
        { name: "manufacturer", label: t("manufacturer"), type: "text", icon: "🏭" },
        { name: "supplier", label: t("supplier"), type: "text", icon: "🚛" },
        { name: "category", label: t("product.category"), type: "text", icon: "🏷️" },
        { name: "purchasePrice", label: t("product.purchasePrice"), type: "number", icon: "💸" },
        { name: "priceForSale", label: t("product.priceForSale"), type: "number", icon: "💵", required: true },
        { name: "minQuantity", label: t("product.minQuantity"), type: "number", icon: "📈" },
        { name: "actualQuantity", label: t("product.qty.actual"), type: "number", icon: "📦", required: true },
        // { name: "purchasePrice", label: t("product.purchasePrice"), type: "number", icon: "💸", required: true, max: 50000 },
        // { name: "priceForSale", label: t("product.priceForSale"), type: "number", icon: "💵", required: true, max: 50000 },
        // { name: "minQuantity", label: t("product.minQuantity"), type: "number", icon: "📈", max: 5000 },
        // { name: "actualQuantity", label: t("product.qty.actual"), type: "number", icon: "📦", max: 5000 },
    ];

    const { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
        initialData: { ...product, ownManufacture: product?.ownManufacture || false },
        fieldsConfig,
        onSubmit: async (data) => {
            try {
                if (!product._id) {
                    await creation(data);
                    toast.success(t("toast.creation.success", { description: data.name }));
                } else {
                    await updating({ id: product._id, data });
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
    // const fieldsFilled = Object.values(form).filter(Boolean).length;

    const requiredFields = ["name", "priceForSale", "actualQuantity"];
    const fieldsFilled = Object.entries(form)
        .filter(([key, value]) => requiredFields.includes(key) && Boolean(value))
        .length;


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

            <div className="w-full">
                <label className="text-2xl block font-medium text-gray-700">{t("unit.measure")}</label>
                <select
                    className="w-full text-lg py-2 px-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 hover:shadow-md transition-all duration-300"
                    name="unitOfMeasurement"
                    value={form.unitOfMeasurement || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    {Object.entries(UnitOfMeasurementEnum).map(([key, value]) => (
                        <option key={key} value={value}>
                            {t(value)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="w-full">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="ownManufacture"
                        checked={form.ownManufacture}
                        onChange={handleChange}
                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded transition duration-200 focus:ring-2 focus:ring-blue-300"
                    />
                    <span className="text-2xl text-gray-900">{t("product.ownManufacture")}</span>
                </label>
            </div>

            <ActionButton
                type="submit"
                bgColor="blue"
                text={isSubmitting ? t("button.saving") : t("button.save")}
                icon={isSubmitting ? "⏳" : "💾"}
                disabled={isSubmitting}
            />
            <ProgressBar value={fieldsFilled || 0} max={requiredFields.length} />

        </form>
    );
}
