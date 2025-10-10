import { useState } from 'react';
import { useTranslation } from "react-i18next";

import ProductForm from "./ProductForm";
import FloatingActionButton from '../../components/FloatingActionButton';
import Modal from '../../components/Modal';


export default function ProductCreate() {
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
            <FloatingActionButton
                onClick={openCreationModal}
                tooltip={t("button.tooltip.form", { domain: t("product") })}
                content={<h1>✚</h1>} 
                position="bottom-40" />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("product") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <ProductForm onClose={closeFormModal} product={productToUpdate} />
            </Modal>
        </div>
    );
}