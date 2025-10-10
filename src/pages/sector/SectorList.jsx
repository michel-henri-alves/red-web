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

export default function SectorList() {
  const { t } = useTranslation();
  const domain = t("sector");

  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 500);
  const [sectorToDelete, setSectorToDelete] = useState(null);
  const [sectorToUpdate, setSectorToUpdate] = useState(null);
  const [expandedSector, setExpandedSector] = useState(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, isLoading, error, fetchNextPage,
    hasNextPage, isFetchingNextPage } =
    fetchAllSectorsPaginated(debouncedFilter, 10);
  const allSectors = data?.pages.flatMap((page) => page.data) ?? [];

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

  const toggleExpand = (code) => {
    setExpandedSector(expandedSector === code ? null : code);
  };


  const openDeleteModal = (sector) => {
    setSectorToDelete(sector);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const openUpdateModal = (sector) => {
    setSectorToUpdate(sector);
    setFormModalOpen(true);
  };
  const openCreationModal = () => {
    setSectorToUpdate({});
    setFormModalOpen(true);
  };
  const closeFormModal = () => setFormModalOpen(false);

  function formatDate(dataIso) {
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }


  if (isLoading) return <p>{t("loading.waiting")}</p>;
  if (error) return <p>{t("loading.error")}</p>;

  return (
    <div className="space-y-4">
      <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("sector.name")} />

      {allSectors.map((sector) => {
        const isExpanded = expandedSector === sector._id;
        return (
          <div
            key={sector._id}
            className="bg-white rounded shadow border hover:shadow-lg transition"
          >
            <button
              onClick={() => toggleExpand(sector._id)}
              className="w-full text-left p-4 flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold">{sector.name}</span>
              <span>{isExpanded ? "▲" : "▼"}</span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-4 pb-4 text-sm text-gray-700">
                  <p>
                    <strong>{t("created.by")}:</strong> {sector.createdBy} <FormattedDate iso={sector.createdAt} />
                  </p>
                  <p>
                    <strong>{t("updated.by")}:</strong> {sector.updatedBy} <FormattedDate iso={sector.updatedAt} />
                  </p>
                  <br />
                  <p>
                    <strong>{t("sector.barcode")}:</strong> {sector.smartCode}
                  </p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-300 cursor-pointer"
                      onClick={() => openDeleteModal(sector)}
                    >
                      🗑&nbsp;{t("button.delete")}
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-300 cursor-pointer"
                      onClick={() => openUpdateModal(sector)}
                    >
                      📝&nbsp;{t("button.update")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

      <FloatingActionButton onClick={openCreationModal} domain={domain} />

      <Modal
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
      </Modal>
    </div>
  );
}
