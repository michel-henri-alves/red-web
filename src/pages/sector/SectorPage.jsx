import { useTranslation } from 'react-i18next'

import SectorList from './SectorList';
import SectorCreate from './SectorCreate';
import SectorDetails from './SectorDetails';



export default function SectorPage() {

  const { t } = useTranslation();

  return (
    <div className="p-4">
      <header className="flex items-center gap-3 mb-3">
        <span className="text-4xl">🏘️</span>
        <div>
          <h1 className="text-xl font-bold">{t("sector.title")}</h1>
        </div>
      </header>
      <SectorList
        renderCreateButton={<SectorCreate />}
        renderExpandedDiv={(sector, isExpanded) => <SectorDetails sector={sector} isExpanded={isExpanded} />}
      />
    </div>
  )
}
