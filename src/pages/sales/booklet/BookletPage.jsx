import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next'

import BookletList from './BookletList';
import BookletCreate from './BookletCreate';

//import BookletDetails from './BookletDetails';

export default function BookletPage() {

  const { t } = useTranslation();
  const { id, name } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">📒 {t('booklet.title', {customerName: name})}</h1>
      <BookletList
        id = {id}
        name = {name}
        renderCreateButton={<BookletCreate />}
        // renderExpandedDiv={(customer, isExpanded) => {}
          // <BookletDetails customer={customer} isExpanded={isExpanded} />
        // }
      />
    </div>
  )
}