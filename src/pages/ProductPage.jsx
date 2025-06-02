import React, { useState } from 'react';
import ProductList from '../components/ProductList';

export default function ProductPage() {

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Manager 3</h1>
      <ProductList />
    </div>
  )
}
