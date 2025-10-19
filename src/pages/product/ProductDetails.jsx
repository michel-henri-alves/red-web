import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import ProductButtons from './ProductButtons';
import formatDate from "../../shared/utils/dateUtils";
import InfoTag from '../../components/InfoTag';

export default function ProductDetails({ product, isExpanded }) {
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
                            <InfoTag inputData={product.category} label={t("product.category")} />
                            <InfoTag inputData={product.manufacturer} label={t("manufacturer")} />
                            <InfoTag inputData={product.supplier} label={t("supplier")} />
                            <InfoTag inputData={product.purchasePrice} label={t("product.purchasePrice")} />
                            <InfoTag inputData={product.createdBy} label={t("created.by")} />
                            <InfoTag inputData={formatDate(product.createdAt)} label={t("created.at")} />
                            <InfoTag inputData={product.updatedBy} label={t("updated.by")} />
                            <InfoTag inputData={formatDate(product.updatedAt)} label={t("updated.at")} />
                            <InfoTag inputData={product.barcode} label={t("product.barcode")} />
                            <InfoTag inputData={product.minQuantity} label={t("product.minQuantity")} />
                            <InfoTag inputData={product.maxQuantity} label={t("product.maxQuantity")} />
                            <InfoTag inputData={product.actualQuantity} label={t("product.qty.actual")} />
                        </div>
                        <ProductButtons product={product} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}