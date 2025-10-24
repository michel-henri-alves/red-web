import { useTranslation } from "react-i18next";
import ActionButton from "./ActionButton";
import formatCurrency from "../shared/utils/formatCurrency";
import {
  Trash
} from "lucide-react";


export default function CartTable({ items, onRemove }) {
  const { t } = useTranslation();
  return (
    <section className="w-full h-[55vh] bg-white dark:bg-slate-800 rounded-lg shadow p-3 flex flex-col shadow">
      <div className="flex-1 overflow-x-auto">
        <table className="min-w-full text-left divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900 sticky top-0">
            <tr>
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2"> {t("product.name")} </th>
              <th className="py-2 px-2 w-32"> {t("product.priceForSale")} </th>
              <th className="py-2 px-2 w-28"> {t("actions")} </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 px-4 text-center text-gray-500">{t("cart.empty")}</td>
              </tr>
            ) : (
              items.map((scan, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-900 transition">
                  <td className="py-2 px-2">{i + 1}</td>
                  <td className="py-2 px-2 align-top break-words">{scan.name}</td>
                  <td className="py-2 px-2 align-top">{formatCurrency(scan.price)}</td>
                  <td className="py-2 px-2 align-top">
                    <ActionButton icon={Trash} bgColor="[rgba(98,70,234)]" onClick={() => onRemove(i)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};