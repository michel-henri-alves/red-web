import { useState } from 'react';
import FloatingActionButton from '../../../components/FloatingActionButton';
import { useTranslation } from "react-i18next";
import BookletForm from "./BookletForm";
import Modal from '../../../components/Modal';


export default function BookletCreate() {
    const { t } = useTranslation();

    const [productToUpdate, setProductToUpdate] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);

    const openCreationModal = () => {
        setProductToUpdate({});
        setFormModalOpen(true); 
    };

    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div>
            <FloatingActionButton onClick={openCreationModal} domain={t("booklet")} />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("booklet") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <BookletForm onClose={closeFormModal} product={productToUpdate} />
            </Modal>
        </div>
    );
}