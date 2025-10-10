import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    removeCustomer
} from "../../shared/hooks/useCustomers";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Modal from "../../components/Modal";
import CustomerForm from "./CustomerForm";

export default function CustomerDeleteUpdate(inputCustomer) {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(inputCustomer);
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
            <button
                className="bg-red-500 text-white px-4 py-2 
                           rounded hover:bg-red-700 cursor-pointer"
                onClick={() => openDeleteModal(customer)}
            >
                🗑&nbsp;{t("button.delete")}
            </button>
            <button
                className="bg-green-500 text-white px-4 py-2 
                           rounded hover:bg-green-700 cursor-pointer"
                onClick={() => openUpdateModal(customer)}
            >
                📝&nbsp;{t("button.update")}
            </button>
            <button
                className="bg-orange-500 text-white px-4 py-2 
                           rounded hover:bg-orange-700 cursor-pointer"
                onClick={() => {
                    navigate(`/booklet/${customer.customer._id}/${customer.customer.name}`)
                }
                }
            >
                📒&nbsp;{t("button.booklet")}
            </button>

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