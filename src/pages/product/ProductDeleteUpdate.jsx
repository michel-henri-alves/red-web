import { useState } from "react";
import { useTranslation } from "react-i18next";
import { removeProduct } from "../../shared/hooks/useProducts";

import ProductForm from "./ProductForm";

import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ActionButton from "../../components/ActionButton";


export default function ProductDeleteUpdate(inputProduct) {
    const { t } = useTranslation();

    const [product, setProduct] = useState(inputProduct);
    const [productToDelete, setProductToDelete] = useState(inputProduct);
    const [productToUpdate, setProductToUpdate] = useState(inputProduct);

    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const openDeleteModal = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const openUpdateModal = (product) => {
        setProductToUpdate(product);
        setFormModalOpen(true);
    };
    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div className="mt-4 flex justify-end space-x-2">
            <ActionButton onClick={() => openDeleteModal(product)} bgColor="rose" text={t("button.delete")} icon="🗑" />
            <ActionButton onClick={() => openUpdateModal(product)} bgColor="indigo" text={t("button.update")} icon="📝" />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("product") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <ProductForm onClose={closeFormModal} product={productToUpdate.product} />
            </Modal>

            <Modal
                title={t("modal.title", { "action": t("button.delete"), "domain": t("product") })}
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}>
                {productToDelete && (
                    <DeleteConfirmationModal
                        onClose={closeDeleteModal}
                        deleteMethod={removeProduct}
                        deleteId={productToDelete.product._id}
                        description={productToDelete.product.name} />
                )}
            </Modal>

        </div>
    );


}