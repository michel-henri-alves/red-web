import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import InfoTag from '../../components/InfoTag';

export default function SaleDetails({ sale, isExpanded }) {
    const { t } = useTranslation();

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-4 pb-4 text-sm text-gray-700">
                    <div className="space-y-4 bg-white mt-6 p-6 text-2xl">
                        <div className="flex flex-wrap gap-3">
                            <InfoTag inputData={sale.vendor} label={t("sales.customer")} />
                            <InfoTag inputData={sale.client} label={t("sales.vendor")} />
                            <InfoTag inputData={
                                <ul>
                                    {sale.paymentMethod.map((item, index) => (
                                        <li key={index}>{t(item)} / {t("currency")} {sale.amountPaid[index]}</li>
                                    ))}
                                </ul>
                            } label={t("sales.payment.method.value")} />
                            <InfoTag inputData={t("currency") + "" + sale.discount} label={t("sales.discount")} />
                            <InfoTag inputData={t("currency") + "" + sale.change} label={t("sales.change")} />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}