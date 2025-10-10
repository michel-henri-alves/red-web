import { useTranslation } from 'react-i18next'

import SaleList from './SaleList';


export default function SalesPage() {

  const { t } = useTranslation();

  return (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">💲 {t('sales.title')}</h1>
        <SaleList />
      </div>
    )
  
}
