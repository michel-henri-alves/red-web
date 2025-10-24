import { useState } from "react";
import { useTranslation } from "react-i18next";
import { removeSector } from "../../shared/hooks/useSectors";

import SectorForm from "./SectorForm";

import Modal from "../../components/Modal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ActionButton from "../../components/ActionButton";
import {
 Trash2,
 NotebookPen,
} from "lucide-react";


export default function SectorButtons(inputSector) {
    const { t } = useTranslation();

    const [sector] = useState(inputSector);
    const [sectorToDelete, setSectorToDelete] = useState(inputSector);
    const [sectorToUpdate, setSectorToUpdate] = useState(inputSector);

    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

    const openDeleteModal = (sector) => {
        setSectorToDelete(sector);
        setDeleteModalOpen(true);
    };

    const closeDeleteModal = () => setDeleteModalOpen(false);

    const openUpdateModal = (sector) => {
        setSectorToUpdate(sector);
        setFormModalOpen(true);
    };
    const closeFormModal = () => setFormModalOpen(false);

    return (
        <div className="mt-4 flex justify-end space-x-2">
            <ActionButton onClick={() => openDeleteModal(sector)} bgColor="[rgba(98,70,234)]" text={t("button.delete")} icon={Trash2} />
            <ActionButton onClick={() => openUpdateModal(sector)} bgColor="[rgba(98,70,234)]" text={t("button.update")} icon={NotebookPen} />

            <Modal
                title={t("modal.title", { "action": t("button.save"), "domain": t("sector") })}
                isOpen={isFormModalOpen}
                onClose={closeFormModal}>
                <SectorForm onClose={closeFormModal} sector={sectorToUpdate.sector} />
            </Modal>

            <Modal
                title={t("modal.title", { "action": t("button.delete"), "domain": t("sector") })}
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}>
                {sectorToDelete && (
                    <DeleteConfirmationModal
                        onClose={closeDeleteModal}
                        deleteMethod={removeSector}
                        deleteId={sectorToDelete.sector._id}
                        description={sectorToDelete.sector.name} />
                )}
            </Modal>

        </div>
    );


}