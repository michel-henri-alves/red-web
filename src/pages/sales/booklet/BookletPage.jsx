import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next'

import BookletList from './BookletList';
import BookletCreate from './BookletCreate';
import BookletDetails from './BookletDetails';

export default function BookletPage() {

  const { t } = useTranslation();
  const { id, name } = useParams();

  return (
    <div className="p-4">

      <header className="flex items-center gap-3 mb-3">
        <span className="text-4xl">📒</span>
        <div>
          <h1 className="text-xl font-bold">{t("booklet.title", {customerName: name} )}</h1>
        </div>
      </header>
      <BookletList
        id = {id}
        name = {name}
        renderCreateButton={<BookletCreate customerId={id} />}
        renderExpandedDiv={(pending, isExpanded) => 
          <BookletDetails pending={pending} isExpanded={isExpanded} />
        }
      />
    </div>
  )
}