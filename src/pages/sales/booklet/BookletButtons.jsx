import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    removePendings
} from "../../../shared/hooks/usePendings";
import Modal from "../../../components/Modal";
import BookletForm from "./BookletForm"; 
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import ActionButton from "../../../components/ActionButton";


export default function BookletButtons(inputBooklet) {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [booklet] = useState(inputBooklet);
        const [pending] = useState(inputBooklet);
console.log("entrada ", inputBooklet)
    const [bookletToDelete, setBookletToDelete] = useState(inputBooklet);
    const [bookletToUpdate, setBookletToUpdate] = useState(inputBooklet);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const openDeleteModal = (booklet) => {
        setBookletToDelete(booklet);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const openUpdateModal = (booklet) => {
        console.log(booklet)
        setBookletToUpdate(booklet);
        setFormModalOpen(true);
    };
    const closeFormModal = () => setFormModalOpen(false);

    const setTitle = (pending) => {
        bookletToDelete.pending.pendingType +" "+ bookletToDelete.pending.amount
            const type = t(pending.pendingType);
            const amount = t("currency") +""+ pending.amount;
            return type + " " + amount;
        }

    return (
        <div className="mt-4 flex justify-end space-x-2">
            <ActionButton onClick={() => openDeleteModal(booklet)} bgColor="red" text={t("button.delete")} icon="🗑" />
            <ActionButton onClick={() => openUpdateModal(booklet)} bgColor="blue" text={t("button.update")} icon="📝" />
            <ActionButton onClick={() => openUpdateModal(booklet)} bgColor="green" text={t("button.notify")} icon="✆" />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("pending") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <BookletForm onClose={closeFormModal} pending={bookletToUpdate.pending} />
            </Modal>

            <Modal
                title={t("modal.title", { "action": t("button.delete"), "domain": t("pending") })}
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}>
                {bookletToDelete && (
                    <DeleteConfirmationModal
                        onClose={closeDeleteModal}
                        deleteMethod={removePendings}
                        deleteId={bookletToDelete.pending._id}
                        description={setTitle(bookletToDelete.pending)} />
                )}
            </Modal>

        </div>
    );


}