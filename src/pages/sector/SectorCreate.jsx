import { useState } from 'react';
import { useTranslation } from "react-i18next";

import SectorForm from "./SectorForm";
import FloatingActionButton from '../../components/FloatingActionButton';
import Modal from '../../components/Modal';


export default function SectorCreate() {
    const { t } = useTranslation();

    const [sectorToUpdate, setSectorToUpdate] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);

    const openCreationModal = () => {
        setSectorToUpdate({});
        setFormModalOpen(true);
    };

    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div>
            <FloatingActionButton
                onClick={openCreationModal}
                tooltip={t("button.tooltip.form", { domain: t("sector") })}
                content={<h1>✚</h1>} 
                position="bottom-40" />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("sector") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <SectorForm onClose={closeFormModal} sector={sectorToUpdate} />
            </Modal>
        </div>
    );
}