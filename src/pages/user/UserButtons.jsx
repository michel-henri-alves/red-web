import { useState } from "react";
import { useTranslation } from "react-i18next";
import { removeUser } from "../../shared/hooks/useUsers";
import UserForm from "./UserForm";
import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ActionButton from "../../components/ActionButton";
import {
    NotebookPen,
    Trash2,
} from "lucide-react";

export default function UserButtons({ user }) {
    const { t } = useTranslation();

    const [userToDelete, setUserToDelete] = useState(user);
    const [userToUpdate, setUserToUpdate] = useState(user);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const openDeleteModal = () => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const openUpdateModal = () => {
        setUserToUpdate(user);
        setFormModalOpen(true);
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);
    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div className="mt-4 flex justify-end space-x-2">
            <ActionButton onClick={openDeleteModal} bgColor="[rgba(98,70,234)]" text={t("button.delete")} icon={Trash2} />
            <ActionButton onClick={openUpdateModal} bgColor="[rgba(98,70,234)]" text={t("button.update")} icon={NotebookPen} />

            <Modal
                title={t("modal.title", { action: t("button.save"), domain: t("user") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <UserForm onClose={closeFormModal} user={userToUpdate} />
            </Modal>

            <Modal
                title={t("modal.title", { action: t("button.delete"), domain: t("user") })}
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}>
                {userToDelete && (
                    <DeleteConfirmationModal
                        onClose={closeDeleteModal}
                        deleteMethod={removeUser}
                        deleteId={userToDelete._id}
                        description={userToDelete.name} />
                )}
            </Modal>
        </div>
    );
}
