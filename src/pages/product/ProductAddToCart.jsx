import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import WeightInput from "../../components/WeightInput";
import FormInput from "../../components/FormInput";

export default function ProductAddToCart({ product, isExpanded, addToCartMethod }) {

    const { t } = useTranslation();
    const [weight, setWeight] = useState(0);
    const [qty, setQty] = useState(0);
    const [form, setForm] = useState(product || {});

    useEffect(() => {
        setForm(product || {});
    }, [product]);

    const handleChange = (e) => {
        const numberValue = e.target.value === "" ? 0 : Number(e.target.value);
        setQty(numberValue);
    };

    const productPrice = (price, measure) => (price * measure).toFixed(2);

    const buildSelectedProduct = (value) => ({
        ...form,
        priceForSale: productPrice(form.priceForSale, value),
    });

    const handleAddToCart = (value) => {
        addToCartMethod(buildSelectedProduct(value));
    };

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-4 text-gray-700"
                >
                    {form.unitOfMeasurement === 'WEIGHT' && (
                        <div className="space-y-4 bg-white mt-4 p-4 rounded-lg shadow-sm md:max-w-md md:mx-auto">
                            <WeightInput setWeightParam={setWeight} label={t("sales.enter.weight")} />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("label.value")}
                                </label>
                                <input
                                    type="text"
                                    tabIndex={-1}
                                    readOnly
                                    value={`${t("currency")} ${productPrice(form.priceForSale, weight)}`}
                                    className="w-full text-red-500 text-3xl font-semibold bg-gray-100 rounded p-2"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleAddToCart(weight)}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg 
                                    hover:bg-blue-700 active:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                🛒 {t("button.add.to.cart")}
                            </button>
                        </div>
                    )}

                    {form.unitOfMeasurement === 'UNIT' && (
                        <div className="space-y-4 bg-white mt-4 p-4 rounded-lg shadow-sm md:max-w-md md:mx-auto">

                            <FormInput
                                label={t("sales.enter.qty")}
                                value={qty}
                                onChange={handleChange}
                                type="number"
                                icon="1️⃣"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("label.value")}
                                </label>
                                <input
                                    type="text"
                                    tabIndex={-1}
                                    readOnly
                                    value={`${t("currency")} ${productPrice(form.priceForSale, qty)}`}
                                    className="w-full text-red-500 text-2xl font-semibold bg-gray-100 rounded p-2"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleAddToCart(qty)}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-lg 
                                    hover:bg-blue-700 active:bg-blue-800 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                🛒 {t("button.add.to.cart")}
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
