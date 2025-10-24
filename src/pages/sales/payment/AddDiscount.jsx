import { useTranslation } from 'react-i18next';
import ActionButton from "../../../components/ActionButton";
import MoneyInput from '../../../components/MoneyInput';
import {
    Check,
    BanknoteArrowDown
} from "lucide-react";

export default function AddDiscount({ updateBill, handleDiscount, discount }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 bg-gray-200 mt-4 p-4 rounded-lg shadow-sm md:max-w-md md:mx-auto">
      <MoneyInput value={discount} onChange={handleDiscount} label={t("sales.enter.discount")} icon={BanknoteArrowDown} />
      <ActionButton type="button" bgColor="[rgba(98,70,234)]" text={t("button.confirm")} onClick={updateBill} icon={Check}/>
    </div>
  );
}