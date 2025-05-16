import React from 'react';
import ProductList from '../components/ProductList';

const ProductPage = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Product Manager</h1>
    <ProductList />
  </div>
);

export default ProductPage;