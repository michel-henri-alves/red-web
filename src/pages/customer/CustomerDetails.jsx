import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import formatDate from "../../shared/utils/dateUtils";
import CustomerButtons from './CustomerButtons';
import InfoTag from '../../components/InfoTag';


export default function CustomerDetails({ customer, isExpanded }) {
    const { t } = useTranslation();
    const customerType = customer.customerType || customer.type || (customer.cnpj || customer.contact ? "PJ" : "PF");
    const contact = customer.contact || {};

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
                            <InfoTag inputData={t(customerType === "PJ" ? "customer.type.pj" : "customer.type.pf")} label={t("customer.type")} />
                            <InfoTag inputData={customer.name} label={t("customer.name")} />
                            <InfoTag inputData={customer.nickname} label={t("customer.nickname")} />
                            <InfoTag inputData={customer.cpf} label={t("customer.cpf")} />
                            <InfoTag inputData={customer.fantasyName} label={t("customer.fantasyName")} />
                            <InfoTag inputData={customer.barcode} label={t("customer.barcode")} />
                            <InfoTag inputData={customer.smartCode} label={t("customer.smartCode")} />
                            <InfoTag inputData={customer.cnpj} label={t("customer.cnpj")} />
                            <InfoTag inputData={customer.phone} label={t("customer.phone")} />
                            <InfoTag inputData={customer.phone2} label={t("customer.phone2")} />
                            <InfoTag inputData={customer.address} label={t("customer.address")} />
                            <InfoTag inputData={customer.cep} label={t("customer.cep")} />
                            <InfoTag inputData={customer.email} label={t("customer.email")} />
                            <InfoTag inputData={customer.website} label={t("customer.website")} />
                            <InfoTag inputData={contact.name} label={t("customer.contact.name")} />
                            <InfoTag inputData={contact.phone} label={t("customer.contact.phone")} />
                            <InfoTag inputData={contact.email} label={t("customer.contact.email")} />
                            <InfoTag inputData={formatDate(customer.birth)} label={t("customer.birth")} />
                            <InfoTag inputData={customer.createdBy} label={t("created.by")} />
                            <InfoTag inputData={formatDate(customer.createdAt)} label={t("customer.createdAt")} />
                            <InfoTag inputData={customer.updatedBy} label={t("updated.by")} />
                            <InfoTag inputData={formatDate(customer.updatedAt)} label={t("customer.updatedAt")} />
                        </div>
                        <CustomerButtons customer={customer} />
                    </div>


                </motion.div>
            )}
        </AnimatePresence>
    );
}
