import { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createProduct, updateProduct } from "../../shared/hooks/useProducts";
import { toast } from "react-toastify";
import { useForm } from "../../hooks/useForm";
import FormInput from "../../components/FormInput";
import ActionButton from "../../components/ActionButton";
import ProgressBar from "../../components/ProgressBar";
import OptionsRange from "../../components/OptionsRange";
import MoneyInput from "../../components/MoneyInput";
import {
    ScanBarcode,
    User,
    Factory,
    Truck,
    Tags,
    BanknoteArrowUp,
    BanknoteArrowDown,
    Box,
    Hourglass,
    Save,
    Dumbbell,
    Boxes,
    Gauge,
    Scale
} from "lucide-react";


export default function ProductForm({ onClose, product = {} }) {
    const { t } = useTranslation();
    const inputRef = useRef(null);
    const {
        mutateAsync: creation,
        isLoading: isCreating
    } = createProduct();
    const { mutateAsync: updating } = updateProduct();

    const [selected, setSelected] = useState(product?.unitOfMeasurement || "UNIT");
    const options = [
        { label: t("UNIT"), value: "UNIT", colorClass: "bg-yellow-500", icon: Box },
        { label: t("WEIGHT"), value: "WEIGHT", colorClass: "bg-green-500", icon: Dumbbell },
    ];

    const fieldsConfig = [
        { name: "smartCode", label: t("product.barcode"), type: "text", icon: ScanBarcode },
        { name: "name", label: t("product.name"), type: "text", icon: User, required: true },
        { name: "manufacturer", label: t("manufacturer"), type: "text", icon: Factory },
        // { name: "supplier", label: t("supplier"), type: "text", icon: Truck },
        { name: "category", label: t("product.category"), type: "text", icon: Tags },
        // { name: "purchasePrice", label: t("product.purchasePrice"), type: "number", icon: BanknoteArrowDown },
        { name: "priceForSale", label: t("product.priceForSale"), type: "number", icon: BanknoteArrowUp, required: true, component: MoneyInput },
        { name: "minQuantity", label: t("product.minQuantity"), type: "number", icon: Gauge },
        { name: "actualQuantity", label: t("product.qty.actual"), type: "number", icon: Boxes, required: true },
    ];

    const { form, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useForm({
        initialData: {
            ...product,
            ownManufacture: product?.ownManufacture || false
        },
        fieldsConfig,
        onSubmit: async (data) => {
            data = { ...data, unitOfMeasurement: selected };
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
    const requiredFields = ["name", "priceForSale", "actualQuantity"];
    const fieldsFilled = Object.entries(form)
        .filter(([key, value]) => requiredFields.includes(key) && Boolean(value))
        .length;


    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-gray-200 p-6 flex flex-wrap gap-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-30"
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
                <span className="flex text-lg text-gray-900"><Scale size={30} className="pr-2" /> {t("unit.measure")}</span>
                <OptionsRange options={options} selected={selected} setSelected={setSelected} />
            </div>

            <div className="w-full">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="ownManufacture"
                        checked={form.ownManufacture}
                        onChange={handleChange}
                        className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded transition duration-200 focus:ring-2 focus:ring-blue-300 cursor-pointer"
                    />
                    <span className="text-2xl text-gray-900">{t("product.ownManufacture")}</span>
                </label>
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
