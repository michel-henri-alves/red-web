import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import FloatingActionButton from "../components/FloatingActionButton";
import Modal from "../components/Modal";
import ProductForm from '../components/ProductForm';

export default function ProductPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Manager 3</h1>
      <ProductList />

      <FloatingActionButton  onClick={openModal} />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ProductForm  onClose={closeModal} />
      </Modal>
    </div>
  )
}
