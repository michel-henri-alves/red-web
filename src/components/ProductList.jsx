import React from 'react';
import { useState } from "react";
// import { AnimatePresence, motion } from "motion/react"
import { listAllProducts, removeOneProduct } from '../hooks/useProducts'
import SearchBar from './SearchBar'
import DeleteConfirmationModal from './DeleteConfirmationModal';
import Modal from "./Modal";


export default function ProductList() {


  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openDeleteModal = (product) => {
    setProductToDelete(product)
    openModal()
  }

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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
  // };


  const { data: products, isLoading, error } = listAllProducts();
  const [expandedProduct, setExpandedProduct] = useState(null);

  // const filteredProducts = products.filter((product) =>
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
      {/* <div>
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.smart_code}>{product.product_name}</li>
          ))}
        </ul>
      </div> */}

      {products.map((product) => {
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
                <p><strong>Description:</strong> {product.description}</p>
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <DeleteConfirmationModal  onClose={closeModal} productToDelete={productToDelete}/>
      </Modal>
    </div>
  );
}