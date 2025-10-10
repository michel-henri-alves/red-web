import { useTranslation } from 'react-i18next'

import CustomerList from './CustomerList';
import CustomerCreate from './CustomerCreate';
import CustomerDetails from './CustomerDetails';

export default function CustomerPage() {
    const { t } = useTranslation();
    
      return (
        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">🙋🏻 {t('customer.title')}</h1>
          <CustomerList
            renderCreateButton={<CustomerCreate/>}
            renderExpandedDiv={(customer, isExpanded) => <CustomerDetails customer={customer} isExpanded={isExpanded} />}
          />
        </div>
      )
}