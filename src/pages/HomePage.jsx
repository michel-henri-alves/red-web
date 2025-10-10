import { useTranslation } from 'react-i18next'

import Dashboard from '../components/Dashboard'; 


export default function HomePage() {

  const { t } = useTranslation();

  return (
      <div className="p-4">
        <Dashboard/>
      </div>
    )
  
}
