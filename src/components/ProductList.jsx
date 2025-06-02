import React from 'react';
import { useState } from "react";
// import { AnimatePresence, motion } from "motion/react"
import {
  listAllProducts,
  removeOneProduct,
  searchProductsRegexByName,
  listAllProductsPaginated
} from '../hooks/useProducts'
import SearchBar from './SearchBar'
import FilterBar from './FilterBar'
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Modal from "./Modal";
import ProductForm from './ProductForm';
import FloatingActionButton from "./FloatingActionButton";


export default function ProductList() {


  const [page, setPage] = useState(1);
  const limit = 10;

  const [productToDelete, setProductToDelete] = useState(null);
  const [productToUpdate, setProductToUpdate] = useState(null);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const openDeleteModal = (product) => {
    setProductToDelete(product)
    setDeleteModalOpen(true);
  }

  const openUpdateModal = (product) => {
    setProductToUpdate(product)
    setIsModalOpen(true);
  }

  const openCreationModal = () => {
    setProductToUpdate({})
    setIsModalOpen(true);
  }

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const openModal = (productName) => {
  //   if (confirm("Você tem certeza que deseja excluir o produto /n ?")) {
  //     // setProducts((prev) => prev.filter((p) => p.smart_code !== smartCode));
  //     console.log(productName)
  //   }
  //   // console.log(isModalOpen)
  //   // setIsModalOpen(true);
  //   // console.log(isModalOpen)
  // }
  // const closeModal = () => setIsModalOpen(false);

  const { mutate: remove } = removeOneProduct();


  // const [searchTerm, setSearchTerm] = useState("");
  // const handleSearch = (term) => {
  //   setSearchTerm(term);
  //   // setProducts(searchProductsRegexByName(term))
  // };


  // const { data: products, isLoading, error } = listAllProductsPaginated(page);
  const { data: products, isLoading, error } = listAllProductsPaginated(page);
  // const [products, setProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);

  // const filteredProducts = products.data.filter((product) =>
  //   product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;

  const toggleExpand = (code) => {
    setExpandedProduct(expandedProduct === code ? null : code);
  };

  return (


    <div className="space-y-4">
      <SearchBar
        // onSearch={handleSearch}
      />


      {/* {products.data.map((product) => { */}
      {products.data.map((product) => {
        const isExpanded = expandedProduct === product.smart_code;
        return (
          <div
            key={product.smart_code}
            className="bg-white rounded shadow border hover:shadow-lg transition"
          >
            <button
              onClick={() => toggleExpand(product.smart_code)}
              className="w-full text-left p-4 flex justify-between items-center"
            >
              <span className="font-semibold">{product.product_name}</span>
              <span>{isExpanded ? "▲" : "▼"}</span>
            </button>

            {/* <AnimatePresence> */}

            {isExpanded && (
              <div
                // initial={{ height: 0, opacity: 0 }}
                // animate={{ height: "auto", opacity: 1 }}
                // exit={{ height: 0, opacity: 0 }}
                // transition={{ duration: 0.3 }}
                className="overflow-hidden px-4 pb-4 text-sm text-gray-700"
              >
                <p><strong>Description:</strong> {product.category}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Responsible:</strong> {product.responsible}</p>
                <div className="mt-2">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-300"
                    onClick={() => openDeleteModal(product)}
                  >
                    Excluir
                  </button>
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-300"
                    onClick={() => openUpdateModal(product)}
                  >
                    Alterar
                  </button>
                </div>
              </div>
            )}
            {/* </AnimatePresence> */}

          </div>
        );
      })}

      {/* {productToDelete && (
        <Modal isOpen={true} onClose={closeModal}>
          <p>Are you sure you want to delete <strong>{productToDelete.product_name}</strong>?</p>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={() => setProductToDelete(null)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setProducts((prev) =>
                  prev.filter((p) => p.smart_code !== productToDelete.smart_code)
                );
                setProductToDelete(null);
              }}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Confirmar
            </button>
          </div>
        </Modal>
      )} */}

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage((product) => Math.max(product - 1, 1))} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((product) => product + 1)}>
          Next
        </button>
      </div>
      <h1>Total de registros: {products.total}</h1>


      <FloatingActionButton onClick={openCreationModal} />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ProductForm onClose={closeModal} product={productToUpdate} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <DeleteConfirmationModal onClose={closeDeleteModal} productToDelete={productToDelete} />
      </Modal>
    </div>
  );
}