import { useState } from 'react';
import { useTranslation } from "react-i18next";

import IssueForm from "./IssueForm";
import FloatingActionButton from '../../components/FloatingActionButton';
import Modal from '../../components/Modal';

export default function IssueCreate() {
    const { t } = useTranslation();

    const [issueToUpdate, setIssueToUpdate] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);

    const openCreationModal = () => {
        setIssueToUpdate({});
        setFormModalOpen(true);
    };

    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div>
            <FloatingActionButton
                onClick={openCreationModal}
                tooltip={t("button.tooltip.form", { domain: t("issue") })}
                content={<h1>✚</h1>}
                position="bottom-40" />

            <Modal
                title={t("modal.title", { action: t("button.save"), domain: t("issue") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <IssueForm onClose={closeFormModal} issue={issueToUpdate} />
            </Modal>
        </div>
    );
}
