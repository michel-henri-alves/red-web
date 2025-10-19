import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "../../shared/hooks/useDebounce";
import { fetchAllSectorsPaginated } from "../../shared/hooks/useSectors";
import { removeSector } from "../../shared/hooks/useSectors"

import FormattedDate from '../../shared/utils/dateUtils';
import FilterBar from "../../components/FilterBar";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import Modal from "../../components/Modal";
import SectorForm from "./SectorForm";
import FloatingActionButton from "../../components/FloatingActionButton";
import ExpandableTable from "../../components/ExpandableTable";

export default function SectorList(
  { renderCreateButton, renderExpandedDiv }
) {
  const { t } = useTranslation();
  const domain = t("sector");

  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 500);
  // const [sectorToDelete, setSectorToDelete] = useState(null);
  // const [sectorToUpdate, setSectorToUpdate] = useState(null);
  // const [expandedSector, setExpandedSector] = useState(null);
  // const [isFormModalOpen, setFormModalOpen] = useState(false);
  // const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, isLoading, error, fetchNextPage,
    hasNextPage, isFetchingNextPage } =
    fetchAllSectorsPaginated(debouncedFilter, 10);
  const allSectors = data?.pages.flatMap((page) => page.data) ?? [];
  // const toggleExpand = (code) => {
  //   setExpandedSector(expandedSector === code ? null : code);
  // };
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  // const openDeleteModal = (sector) => {
  //   setSectorToDelete(sector);
  //   setDeleteModalOpen(true);
  // };
  // const closeDeleteModal = () => setDeleteModalOpen(false);

  // const openUpdateModal = (sector) => {
  //   setSectorToUpdate(sector);
  //   setFormModalOpen(true);
  // };
  // const openCreationModal = () => {
  //   setSectorToUpdate({});
  //   setFormModalOpen(true);
  // };
  // const closeFormModal = () => setFormModalOpen(false);

  if (isLoading) return <p>{t("loading.waiting")}</p>;
  if (error) return <p>{t("loading.error")}</p>;

  return (
    <div className="text-2xl space-y-4">
      <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("sector.name")} />

      {allSectors.map((sector) => {
        return (
          <ExpandableTable
            key={sector._id}
            title={sector.name}
            item={sector}
            expandedDiv={renderExpandedDiv} />
        );
      })}

      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

      {renderCreateButton}

      {/* <FloatingActionButton onClick={openCreationModal} domain={domain} /> */}

      {/* <Modal
        title={t("modal.title", { "action": t("button.save"), "domain": t("sector") })}
        isOpen={isFormModalOpen}
        onClose={closeFormModal}>
        <SectorForm onClose={closeFormModal} sector={sectorToUpdate} />
      </Modal>

      <Modal
        title={t("modal.title", { "action": t("button.delete"), "domain": t("sector") })}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}>
        {sectorToDelete && (
          <DeleteConfirmationModal
            onClose={closeDeleteModal}
            deleteMethod={removeSector}
            deleteId={sectorToDelete._id}
            description={sectorToDelete.name} />
        )}
      </Modal> */}
    </div>
  );
}
