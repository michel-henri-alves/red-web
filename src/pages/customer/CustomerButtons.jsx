import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    removeCustomer
} from "../../shared/hooks/useCustomers";
import Modal from "../../components/Modal";
import CustomerForm from "./CustomerForm";

import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ActionButton from "../../components/ActionButton";
import {
 Trash,
 NotebookPen,
 Notebook,
} from "lucide-react";


export default function CustomerButtons(inputCustomer) {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [customer] = useState(inputCustomer);
    const [customerToDelete, setCustomerToDelete] = useState(inputCustomer);
    const [customerToUpdate, setCustomerToUpdate] = useState(inputCustomer);

    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const openDeleteModal = (customer) => {
        setCustomerToDelete(customer);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const openUpdateModal = (customer) => {
        setCustomerToUpdate(customer);
        setFormModalOpen(true);
    };
    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div className="mt-4 flex justify-end space-x-2">
            <ActionButton onClick={() => openDeleteModal(customer)} bgColor="[rgba(98,70,234)]" text={t("button.delete")} icon={Trash} />
            <ActionButton onClick={() => openUpdateModal(customer)} bgColor="[rgba(98,70,234)]" text={t("button.update")} icon={NotebookPen} />
            <ActionButton onClick={() => navigate("/booklet", { state: { customer: customer } })} bgColor="[rgba(98,70,234)]" text={t("button.booklet")} icon={Notebook} />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("customer") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <CustomerForm onClose={closeFormModal} customer={customerToUpdate.customer} />
            </Modal>

            <Modal
                title={t("modal.title", { "action": t("button.delete"), "domain": t("customer") })}
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}>
                {customerToDelete && (
                    <DeleteConfirmationModal
                        onClose={closeDeleteModal}
                        deleteMethod={removeCustomer}
                        deleteId={customerToDelete.customer._id}
                        description={customerToDelete.customer.name} />
                )}
            </Modal>

        </div>
    );


}