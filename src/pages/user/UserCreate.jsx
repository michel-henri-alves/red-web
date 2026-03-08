import { useState } from 'react';
import FloatingActionButton from '../../components/FloatingActionButton';
import { useTranslation } from "react-i18next";
import UserForm from "./UserForm";
import Modal from '../../components/Modal';


export default function UserCreate() {
    const { t } = useTranslation();

    const [userToUpdate, setUserToUpdate] = useState(null);
    const [isFormModalOpen, setFormModalOpen] = useState(false);

    const openCreationModal = () => {
        setUserToUpdate({});
        setFormModalOpen(true);
    };

    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div>
            <FloatingActionButton
                onClick={openCreationModal}
                tooltip={t("button.tooltip.form", { domain: t("user") })}
                content={<h1>✚</h1>}
                position="bottom-40" />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("user") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <UserForm onClose={closeFormModal} user={userToUpdate} />
            </Modal>
        </div>
    );
}