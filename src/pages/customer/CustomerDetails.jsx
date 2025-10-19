import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import FormattedDate from '../../shared/utils/dateUtils';
import CustomerButtons from './CustomerButtons';
import InfoTag from '../../components/InfoTag';

export default function CustomerDetails({ customer, isExpanded }) {
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
                            <InfoTag inputData={customer.name} label={t("customer.name")} />
                            <InfoTag inputData={customer.nickname} label={t("customer.nickname")} />
                            <InfoTag inputData={customer.barcode} label={t("customer.barcode")} />
                            <InfoTag inputData={customer.phone} label={t("customer.phone")} />
                            <InfoTag inputData={customer.address} label={t("customer.address")} />
                            <InfoTag inputData={customer.email} label={t("customer.email")} />
                            <InfoTag inputData={<FormattedDate iso={customer.birth} />} label={t("customer.birth")} />
                            <InfoTag inputData={customer.createdBy} label={t("created.by")} />
                            <InfoTag inputData={<FormattedDate iso={customer.createdAt} />} label={t("created.at")} />
                            <InfoTag inputData={customer.updatedBy} label={t("updated.by")} />
                            <InfoTag inputData={<FormattedDate iso={customer.updatedAt} />} label={t("updated.at")} />
                        </div>
                        <CustomerButtons customer={customer} />
                    </div>


                </motion.div>
            )}
        </AnimatePresence>
    );
}