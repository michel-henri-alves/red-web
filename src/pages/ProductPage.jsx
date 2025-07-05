import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'

import ProductList from '../components/ProductList';

export default function ProductPage() {

  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{t('product.title')}</h1>
      <ProductList />
    </div>
  )
}
