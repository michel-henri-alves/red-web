import { useTranslation } from 'react-i18next';
import ActionButton from "../../../components/ActionButton";
import MoneyInput from '../../../components/MoneyInput';
import {
    Check,
    BanknoteArrowDown,
    Percent
} from "lucide-react";

export const isWholePercentageValue = (value) => value === "" || /^\d+$/.test(String(value));

export const calculatePercentageDiscount = (total, percentage) => {
  const safeTotal = Number(total) || 0;
  const safePercentage = Number(percentage) || 0;

  return Math.round(((safeTotal * safePercentage) / 100 + Number.EPSILON) * 100) / 100;
};

export default function AddDiscount({
  updateBill,
  handleDiscount,
  handlePercentageDiscount,
  discount,
  discountPercentage,
  discountType,
  onDiscountTypeChange,
  discountError,
}) {
  const { t } = useTranslation();

  const isPercentageDiscount = discountType === "percentage";

  return (
    <div className="space-y-4 bg-gray-200 mt-4 p-4 rounded-lg shadow-sm md:max-w-md md:mx-auto">
      <fieldset className="space-y-3">
        <legend className="text-lg font-medium text-gray-700">{t("sales.discount.type")}</legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-semibold transition-colors ${!isPercentageDiscount ? "border-purple-600 bg-purple-100 text-purple-900" : "border-gray-300 bg-white text-gray-700"}`}
            onClick={() => onDiscountTypeChange("amount")}
            aria-pressed={!isPercentageDiscount}
          >
            <BanknoteArrowDown size={24} />
            <span>{t("sales.discount.amount")}</span>
          </button>
          <button
            type="button"
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-semibold transition-colors ${isPercentageDiscount ? "border-purple-600 bg-purple-100 text-purple-900" : "border-gray-300 bg-white text-gray-700"}`}
            onClick={() => onDiscountTypeChange("percentage")}
            aria-pressed={isPercentageDiscount}
          >
            <Percent size={24} />
            <span>{t("sales.discount.percentage")}</span>
          </button>
        </div>
      </fieldset>

      {isPercentageDiscount ? (
        <div className="w-full relative">
          <label htmlFor="discount-percentage" className="flex items-center space-x-2 text-lg font-medium text-gray-700 mb-1">
            <Percent size={30} />
            <span>{t("sales.enter.discount.percentage")}</span>
          </label>
          <input
            id="discount-percentage"
            name="discountPercentage"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={discountPercentage ?? ""}
            placeholder="0"
            onChange={handlePercentageDiscount}
            onKeyDown={(event) => {
              if (["-", "+", ".", ",", "e", "E"].includes(event.key)) {
                event.preventDefault();
              }
            }}
            className={`bg-white w-full py-3 px-4 text-lg rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-md hover:shadow-lg transition-all duration-200 ${discountError ? "border-red-500" : "border-gray-300"}`}
            aria-invalid={!!discountError}
            aria-describedby={discountError ? "discount-error" : undefined}
          />
        </div>
      ) : (
        <MoneyInput value={discount} onChange={handleDiscount} label={t("sales.enter.discount")} icon={BanknoteArrowDown} />
      )}

      {discountError && <p id="discount-error" className="text-sm font-medium text-red-600">{discountError}</p>}
      <ActionButton type="button" bgColor="[rgba(98,70,234)]" text={t("button.confirm")} onClick={updateBill} icon={Check}/>
    </div>
  );
}
