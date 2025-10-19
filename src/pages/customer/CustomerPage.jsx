import { useTranslation } from 'react-i18next'

import CustomerList from './CustomerList';
import CustomerCreate from './CustomerCreate';
import CustomerDetails from './CustomerDetails';

export default function CustomerPage() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <header className="flex items-center gap-3 mb-3">
        <span className="text-4xl">🙋🏻</span>
        <div>
          <h1 className="text-xl font-bold">{t("customer.title")}</h1>
        </div>
      </header>
      <CustomerList
        renderCreateButton={<CustomerCreate />}
        renderExpandedDiv={(customer, isExpanded) => <CustomerDetails customer={customer} isExpanded={isExpanded} />}
      />
    </div>
  )
}