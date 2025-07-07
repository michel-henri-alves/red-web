import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "red-shared";
import {
  useInfiniteProducts,
  removeOneProduct
} from "red-shared";

import FormattedDate from 'red-shared/components/FormattedDate';
import FilterBar from "./FilterBar";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Modal from "./Modal";
import ProductForm from "./ProductForm";
import FloatingActionButton from "./FloatingActionButton";

export default function ProductList() {
  const { t } = useTranslation();
  const domain = t("product");

  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 500);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToUpdate, setProductToUpdate] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts(debouncedFilter, 10);
  const allProducts = data?.pages.flatMap((page) => page.data) ?? [];

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
    setExpandedProduct(expandedProduct === code ? null : code);
  };


  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const openUpdateModal = (product) => {
    setProductToUpdate(product);
    setFormModalOpen(true);
  };
  const openCreationModal = () => {
    setProductToUpdate({});
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
      <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("product.name")} />

      {allProducts.map((product) => {
        const isExpanded = expandedProduct === product.smartCode;
        return (
          <div
            key={product.smartCode}
            className="bg-white rounded shadow border hover:shadow-lg transition"
          >
            <button
              onClick={() => toggleExpand(product.smartCode)}
              className="w-full text-left p-4 flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold">{product.name}</span>
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
                    <strong>{t("product.category")}:</strong> {product.category}
                  </p>
                  <p>
                    <strong>{t("manufacturer")}:</strong> {product.manufacturer}
                  </p>
                  <br />
                  <p>
                    <strong>{t("supplier")}:</strong> {product.supplier}
                  </p>
                  <p>
                    <strong>{t("product.purchasePrice")}:</strong> ${product.purchasePrice}
                  </p>
                  <br />
                  <p>
                    <strong>{t("created.by")}:</strong> {product.createdBy} <FormattedDate iso={product.createdAt} />
                  </p>
                  <p>
                    <strong>{t("updated.by")}:</strong> {product.updatedBy} <FormattedDate iso={product.updatedAt} />
                  </p>
                  <br />
                  <p>
                    <strong>{t("product.barcode")}:</strong> {product.smartCode}
                  </p>
                  <p>
                    <strong>{t("product.minQuantity")}:</strong> {product.minQuantity}
                  </p>
                  <p>
                    <strong>{t("product.maxQuantity")}:</strong> {product.maxQuantity}
                  </p>
                  <p>
                    <strong>{t("product.qty.actual")}:</strong> {product.actualQuantity}
                  </p>
                  <br />
                  <p>
                    <strong>{t("product.priceForSale")}:</strong>
                  </p>
                  <p className="text-red-500 text-3xl">
                    {t("product.priceByUnit", { price: product.priceForSale, unit: t(product.unitOfMeasurement) })}
                  </p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-300 cursor-pointer"
                      onClick={() => openDeleteModal(product)}
                    >
                      🗑&nbsp;{t("button.delete")}
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-300 cursor-pointer"
                      onClick={() => openUpdateModal(product)}
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

      <Modal isOpen={isFormModalOpen} onClose={closeFormModal}>
        <ProductForm onClose={closeFormModal} product={productToUpdate} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        {productToDelete && (
          <DeleteConfirmationModal
            onClose={closeDeleteModal}
            deleteMethod={removeOneProduct}
            deleteId={productToDelete._id}
            description={productToDelete.name} />
        )}
      </Modal>
    </div>
  );
}
