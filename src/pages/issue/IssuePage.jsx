import { useTranslation } from 'react-i18next';

import IssueList from './IssueList';
import IssueCreate from './IssueCreate';
import IssueDetails from './IssueDetails';

export default function IssuePage() {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <header className="flex items-center gap-3 mb-3">
        <span className="text-4xl">⚠️</span>
        <div>
          <h1 className="text-xl font-bold">{t("issue.title")}</h1>
        </div>
      </header>
      <IssueList
        renderCreateButton={<IssueCreate />}
        renderExpandedDiv={(issue, isExpanded) => <IssueDetails issue={issue} isExpanded={isExpanded} />}
      />
    </div>
  );
}
