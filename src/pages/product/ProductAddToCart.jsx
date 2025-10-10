import { useState, useRef, useEffect } from "react";
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
        const value = e.target.value;
        const numberValue = value === "" ? 0 : Number(value);

        setQty(numberValue);
    };


    const productPrice = (priceOfProduct, measure) => {
        var calculatedPrice = (priceOfProduct * measure).toFixed(2);
        return calculatedPrice
    }


    const selectByWeight = () => {
        console.log(JSON.stringify(form))
        const productSelected = {
            ...form,
            priceForSale: (form.priceForSale * weight).toFixed(2)
        };
        addToCartMethod(productSelected)
    }

    const selectByUnit = () => {
        console.log(JSON.stringify(form))
        const productSelected = {
            ...form,
            priceForSale: (form.priceForSale * qty).toFixed(2)
        };
        addToCartMethod(productSelected)
    }


    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-4 text-2xl text-gray-700">
                    {form.unitOfMeasurement === 'WEIGHT' && (
                        <div className="space-y-4 bg-white mt-6 p-6">
                            <WeightInput setWeightParam={setWeight} label={t("sales.enter.weight")} />

                            <label className="block font-medium text-gray-700">Valor</label>

                            <input type="text" tabIndex={-1}
                                value={t("currency") + " " + productPrice(form.priceForSale, weight)}
                                className="text-red-500 text-6xl" />

                            <button
                                type="button"
                                onClick={selectByWeight}
                                className="w-full bg-gray-300 text-gray-350 py-2 px-4 rounded cursor-pointer transition
                                hover:bg-blue-700 text-white active:bg-blue-200
                                focus:bg-blue-700 text-white active:bg-blue-200"
                            >
                                🛒 {t("button.add.to.cart")}
                            </button>
                        </div>
                    )}
                    {form.unitOfMeasurement === 'UNIT' &&
                        <div className="space-y-4 bg-white mt-6 p-6">

                            <FormInput
                                label={t("sales.enter.qty")}
                                value={qty}
                                onChange={handleChange}
                                icon="1️⃣"
                                type="number" />

                            <br />
                            <br />
                            <label className="block text-xl font-medium text-gray-700">Valor</label>
                            {t("currency")}
                            <input type="text" tabIndex={-1}
                                value={productPrice(form.priceForSale, qty)}
                                className="text-red-500 text-2xl" />
                            <br />
                            <button
                                type="button"
                                onClick={selectByUnit}
                                className="w-full bg-gray-300 text-gray-350 py-2 px-4 rounded cursor-pointer transition
                                hover:bg-blue-700 text-white active:bg-blue-200
                                focus:bg-blue-700 text-white active:bg-blue-200"
                            >
                                🛒 {t("button.add.to.cart")}
                            </button>
                        </div>
                    }
                </motion.div>
            )}
        </AnimatePresence>
    );
}