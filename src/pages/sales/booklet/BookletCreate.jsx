import { useState } from 'react';
import { useTranslation } from "react-i18next";
import FloatingActionButton from '../../../components/FloatingActionButton';
import Modal from '../../../components/Modal';
import BookletForm from "./BookletForm";


export default function BookletCreate(customerId) {
    const { t } = useTranslation();

    const [pendingToUpdate, setPendingToUpdate] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);

    const openCreationModal = () => {
        setPendingToUpdate({});
        setFormModalOpen(true);
    };

    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div>
            <FloatingActionButton
                onClick={openCreationModal}
                tooltip={t("button.tooltip.form", { domain: t("booklet") })}
                content={<h1>✚</h1>}
                position="bottom-40" />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("booklet") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <BookletForm onClose={closeFormModal} pending={pendingToUpdate} customerId={customerId}  />
            </Modal>
        </div>
    );
}