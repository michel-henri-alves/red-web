import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    removePendings
} from "../../../shared/hooks/usePendings";
import { useWhatsAppMessage } from "../../../hooks/useWhatsAppMessage";
import Modal from "../../../components/Modal";
import BookletForm from "./BookletForm";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import ActionButton from "../../../components/ActionButton";
import {
    Trash,
    NotebookPen,
    MessageSquare
} from "lucide-react";


export default function BookletButtons(inputBooklet) {

    const { t } = useTranslation();
    const [booklet] = useState(inputBooklet);
    const [bookletToDelete, setBookletToDelete] = useState(inputBooklet);
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const { openWhatsApp } = useWhatsAppMessage();

    const openDeleteModal = (booklet) => {
        setBookletToDelete(booklet);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const openUpdateModal = () => {
        setFormModalOpen(true);
    };
    const closeFormModal = () => setFormModalOpen(false);

    const setTitle = (pending) => {
        bookletToDelete.pending.pendingType + " " + bookletToDelete.pending.amount
        const type = t(pending.pendingType);
        const amount = t("currency") + "" + pending.amount;
        return type + " " + amount;
    }

    const notifyByWhatsApp = () => {
        let phone = t("message.phone.number", {"phoneNumber": booklet.customer.phone});
        let message = t("sales.pending.whatsapp", { type: t(booklet.pending.pendingType), value: booklet.pending.amount, owner: "Padaria Flor do Campo" });
        openWhatsApp(phone, message);
    }
    

    return (
        <div className="mt-4 flex justify-end space-x-2">
            <ActionButton onClick={() => openDeleteModal(booklet)} bgColor="[rgba(98,70,234)]" text={t("button.delete")} icon={Trash} />
            <ActionButton onClick={() => openUpdateModal()} bgColor="[rgba(98,70,234)]" text={t("button.update")} icon={NotebookPen} />
            <ActionButton onClick={() => notifyByWhatsApp()} bgColor="[rgba(98,70,234)]" text={t("button.notify")} icon={MessageSquare} />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("pending") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <BookletForm onClose={closeFormModal} pending={booklet.pending} />
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