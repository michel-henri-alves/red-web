import { useTranslation } from 'react-i18next'

import UserList from './UserList';
import UserCreate from './UserCreate';
import UserDetails from './UserDetails';

export default function UserPage() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <header className="flex items-center gap-3 mb-3">
        <span className="text-4xl">🙋🏻‍♂️</span>
        <div>
          <h1 className="text-xl font-bold">{t("user.title")}</h1>
        </div>
      </header>
      <UserList
        renderCreateButton={<UserCreate/>}
        renderExpandedDiv={(user, isExpanded) => <UserDetails user={user} isExpanded={isExpanded} />}
      />
    </div>
  )
}