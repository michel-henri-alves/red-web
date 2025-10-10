import { useTranslation } from 'react-i18next'

import ProductList from './ProductList';
import ProductCreate from './ProductCreate';
import ProductDetails from './ProductDetails';

export default function ProductPage() {

  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">📦 {t('product.title')}</h1>
      <ProductList
        renderCreateButton={<ProductCreate/>}
        renderExpandedDiv={(product, isExpanded) => <ProductDetails product={product} isExpanded={isExpanded} />}
      />
    </div>
  )
}
