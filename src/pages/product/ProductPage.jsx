import { useTranslation } from 'react-i18next'

import ProductList from './ProductList';
import ProductCreate from './ProductCreate';
import ProductDetails from './ProductDetails';

export default function ProductPage() {

  const { t } = useTranslation();

  return (
    <div className="p-4">

      <header className="flex items-center gap-3 mb-3">
        <span className="text-4xl">📦</span>
        <div>
          <h1 className="text-xl font-bold">{t("product.title")}</h1>
        </div>
      </header>
      <ProductList
        renderCreateButton={<ProductCreate />}
        renderExpandedDiv={(product, isExpanded) => <ProductDetails product={product} isExpanded={isExpanded} />}
      />
    </div>
  )
}
