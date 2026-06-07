import { useState } from "react";
import { useTranslation } from "react-i18next";
import { removeIssue } from "../../shared/hooks/useIssues";

import IssueForm from "./IssueForm";

import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ActionButton from "../../components/ActionButton";
import {
 Trash2,
 NotebookPen,
} from "lucide-react";

export default function IssueButtons({ issue }) {
    const { t } = useTranslation();

    const [issueToDelete, setIssueToDelete] = useState(issue);
    const [issueToUpdate, setIssueToUpdate] = useState(issue);

    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const issueDescription = issue.internalId || issue.workflow || t("issue");

    const openDeleteModal = (selectedIssue) => {
        setIssueToDelete(selectedIssue);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const openUpdateModal = (selectedIssue) => {
        setIssueToUpdate(selectedIssue);
        setFormModalOpen(true);
    };
    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div className="mt-4 flex justify-end space-x-2">
            <ActionButton onClick={() => openDeleteModal(issue)} bgColor="[rgba(98,70,234)]" text={t("button.delete")} icon={Trash2} />
            <ActionButton onClick={() => openUpdateModal(issue)} bgColor="[rgba(98,70,234)]" text={t("button.update")} icon={NotebookPen} />

            <Modal
                title={t("modal.title", { action: t("button.save"), domain: t("issue") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <IssueForm onClose={closeFormModal} issue={issueToUpdate} />
            </Modal>

            <Modal
                title={t("modal.title", { action: t("button.delete"), domain: t("issue") })}
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}>
                {issueToDelete && (
                    <DeleteConfirmationModal
                        onClose={closeDeleteModal}
                        deleteMethod={removeIssue}
                        deleteId={issueToDelete._id}
                        description={issueDescription} />
                )}
            </Modal>
        </div>
    );
}
