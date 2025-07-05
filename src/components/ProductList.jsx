import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "red-shared";
import {
  useInfiniteProducts,
  removeOneProduct
} from "red-shared";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const openCreationModal = () => {
    setProductToUpdate({});
    setIsModalOpen(true);
  };

  if (isLoading) return <p>{t("loading.waiting")}</p>;
  if (error) return <p>{t("loading.error")}</p>;

  return (
    <div className="space-y-4">
      <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("product.name")} />

      {allProducts.map((product) => {
        const isExpanded = expandedProduct === product.smart_code;
        return (
          <div
            key={product.smart_code}
            className="bg-white rounded shadow border hover:shadow-lg transition"
          >
            <button
              onClick={() => toggleExpand(product.smart_code)}
              className="w-full text-left p-4 flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold">{product.product_name}</span>
              <span>{isExpanded ? "▲" : "▼"}</span>
            </button>

            {isExpanded && (
              <div className="overflow-hidden px-4 pb-4 text-sm text-gray-700">
                <p>
                  <strong>{t("product.category")}:</strong> {product.category}
                </p>
                <p>
                  <strong>{t("product.price")}:</strong> ${product.price}
                </p>
                <p>
                  <strong>{t("product.responsible")}:</strong>{" "}
                  {product.responsible}
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
              </div>
            )}
          </div>
        );
      })}

      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

      <FloatingActionButton onClick={openCreationModal} domain={domain} />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ProductForm onClose={closeModal} product={productToUpdate} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        {productToDelete && (
          <DeleteConfirmationModal
            onClose={closeDeleteModal}
            deleteMethod={removeOneProduct}
            deleteId={productToDelete._id}
            description={productToDelete.product_name} />
        )}
      </Modal>
    </div>
  );
}
