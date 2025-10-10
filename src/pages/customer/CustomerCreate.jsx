import { useState } from 'react';
import FloatingActionButton from '../../components/FloatingActionButton';
import { useTranslation } from "react-i18next";
import CustomerForm from "./CustomerForm";
import Modal from '../../components/Modal';


export default function CustomerCreate() {
    const { t } = useTranslation();

    const [customerToUpdate, setCustomerToUpdate] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);

    const openCreationModal = () => {
        setCustomerToUpdate({});
        setFormModalOpen(true);
    };

    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div>
            <FloatingActionButton onClick={openCreationModal} domain={t("customer")} />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("customer") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <CustomerForm onClose={closeFormModal} customer={customerToUpdate} />
            </Modal>
        </div>
    );
}