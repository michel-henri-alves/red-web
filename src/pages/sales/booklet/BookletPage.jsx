import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import BookletList from './BookletList';
import BookletCreate from './BookletCreate';
import BookletDetails from './BookletDetails';

export default function BookletPage() {

  const { t } = useTranslation();
  const { state } = useLocation();
  const customer = state?.customer.customer;
  const customerName = [customer.name, customer.nickname].filter(Boolean).join(" ");

  return (
    <div className="p-4">
      <header className="flex items-center gap-3 mb-3">
        <span className="text-4xl">📒</span>
        <div>
          <h1 className="text-xl font-bold">{t("booklet.title", { customerName: customerName  })}</h1>
        </div>
      </header>
      <BookletList
        id={customer._id}
        name={customer.name}
        renderCreateButton={<BookletCreate customerId={customer._id} />}
        renderExpandedDiv={(pending, isExpanded) =>
          <BookletDetails pending={pending} customer={customer} isExpanded={isExpanded} />
        }
      />
    </div>
  )
}