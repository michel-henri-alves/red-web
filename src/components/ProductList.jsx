import React from 'react';
import { useProducts } from '../hooks/useProducts';

const ProductList = () => {
  const { data: products, isLoading, error } = useProducts();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>{product.product_name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;