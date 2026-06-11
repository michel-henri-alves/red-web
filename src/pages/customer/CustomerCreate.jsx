import { useState } from 'react';
import FloatingActionButton from '../../components/FloatingActionButton';
import { useTranslation } from "react-i18next";
import CustomerForm from "./CustomerForm";
import Modal from '../../components/Modal';
import { Building2, UserRound } from "lucide-react";


export default function CustomerCreate() {
    const { t } = useTranslation();

    const [customerToUpdate, setCustomerToUpdate] = useState(null);
    const [selectedCustomerType, setSelectedCustomerType] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);

    const openCreationModal = () => {
        setCustomerToUpdate({});
        setSelectedCustomerType(null);
        setFormModalOpen(true);
    };

    const closeFormModal = () => {
        setFormModalOpen(false);
        setSelectedCustomerType(null);
    };

    const selectCustomerType = (customerType) => {
        setSelectedCustomerType(customerType);
        setCustomerToUpdate({ customerType });
    };

    return (
        <div>
            <FloatingActionButton
                onClick={openCreationModal}
                tooltip={t("button.tooltip.form", { domain: t("customer") })}
                content={<h1>✚</h1>}
                position="bottom-40" />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("customer") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                {!selectedCustomerType ? (
                    <div className="bg-gray-200 p-6 rounded-2xl shadow-xl space-y-4">
                        <fieldset>
                            <legend className="text-lg font-semibold text-gray-800 mb-3">
                                {t("customer.type.select")}
                            </legend>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => selectCustomerType("PF")}
                                    className="flex items-center justify-center gap-3 rounded-lg bg-[rgba(98,70,234)] px-6 py-4 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <UserRound size={28} />
                                    <span>{t("customer.type.pf")}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => selectCustomerType("PJ")}
                                    className="flex items-center justify-center gap-3 rounded-lg bg-[rgba(98,70,234)] px-6 py-4 text-white font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
                                >
                                    <Building2 size={28} />
                                    <span>{t("customer.type.pj")}</span>
                                </button>
                            </div>
                        </fieldset>
                    </div>
                ) : (
                    <CustomerForm onClose={closeFormModal} customer={customerToUpdate} />
                )}
            </Modal>
        </div>
    );
}
