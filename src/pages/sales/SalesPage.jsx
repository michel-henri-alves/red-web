import { useTranslation } from 'react-i18next'

import SaleList from './SaleList';
import SaleDetails from './SaleDetails';


export default function SalesPage() {

  const { t } = useTranslation();

  return (
    <div className="p-4">

      <header className="flex items-center gap-3 mb-3">
        <span className="text-4xl">💲</span>
        <div>
          <h1 className="text-xl font-bold">{t("sales.title")}</h1>
        </div>
      </header>
      <SaleList
        renderExpandedDiv={(sale, isExpanded) => <SaleDetails sale={sale} isExpanded={isExpanded} />}
      />
    </div>
  )

}
