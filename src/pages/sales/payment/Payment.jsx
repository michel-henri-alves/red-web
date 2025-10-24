import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { createSale } from '../../../shared/hooks/useSales';
import { useKeyboardShortcut } from "../../../hooks/useKeyboardShortcut";
import { useNavigate } from "react-router-dom";
import CustomerList from '../../customer/CustomerList';
import CustomerAddDue from './CustomerAddDue';
import AddDiscount from './AddDiscount';
import Modal from '../../../components/Modal';
import MoneyInput from '../../../components/MoneyInput';
import ActionButton from '../../../components/ActionButton';
import OptionsRange from '../../../components/OptionsRange';
import {
  CreditCard,
  Banknote,
  Notebook,
  Smartphone,
  HandCoins,
  BadgeDollarSign,
  BanknoteArrowDown
} from "lucide-react";

export default function Payment({ total }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    mutate: creation,
    isLoading: isLoadingCreation,
  } = createSale();

  const [payed, setPayed] = useState(0);
  const [paying, setPaying] = useState();
  const [due, setDue] = useState(total ?? 0);
  const [change, setChange] = useState(0);
  const [discount, setDiscount] = useState();
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [amountPaid, setAmountPaid] = useState([]);
  const [isOpenRegisterDue, setOpenRegisterDue] = useState(false);
  const [isOpenDiscount, setOpenDiscount] = useState(false);

  // const btnRefs = Array.from({ length: 9 }).map(() => useRef(null));
  // ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9"].forEach((key, idx) =>
  //   useKeyboardShortcut([key], () => btnRefs[idx]?.current?.click())
  // );
  const inputRef = useRef(null);

  const btnRefs = {
    f1: useRef(null),
    f2: useRef(null),
    f3: useRef(null),
    f4: useRef(null),
    f5: useRef(null),
    f6: useRef(null),
    f7: useRef(null),
    f8: useRef(null),
    f9: useRef(null),
    Escape: useRef(null),
  };

  Object.entries(btnRefs).forEach(([key, ref]) => {
    useKeyboardShortcut([key.toUpperCase()], () => {
      // Se for input → focus
      if (ref.current?.tagName === "INPUT") {
        ref.current.focus();
        return;
      }

      // Se for botão → click
      ref.current?.click();
    });
  });

  const [selected, setSelected] = useState("debit");

  const options = [
    { label: t("debit") + " (F1)", value: "debit", colorClass: "bg-orange-500", icon: CreditCard, ref: btnRefs.f1 },
    { label: t("credit") + " (F2)", value: "credit", colorClass: "bg-green-500", icon: CreditCard, ref: btnRefs.f2 },
    { label: t("money") + " (F3)", value: "money", colorClass: "bg-yellow-500", icon: Banknote, ref: btnRefs.f3 },
    { label: t("pix") + " (F4)", value: "pix", colorClass: "bg-cyan-500", icon: Smartphone, ref: btnRefs.f4 },
    { label: t("pay.later") + " (F5)", value: "pay.later", colorClass: "bg-blue-500", icon: Notebook, ref: btnRefs.f5 },
  ];

  const displayValue = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      const length = String(input.value || "").length;
      try {
        input.setSelectionRange(length, length);
      } catch (err) {
        // alguns browsers input type=text podem não suportar setSelectionRange em todos os casos
      }
    }
  }, [payed]);

  const setTotalValueForPay = () => {
    setPaying(due.toFixed(2));
  };

  const handlePendingDebtRegister = () => {
    setOpenRegisterDue(true);
  };

  const updateBill = () => {
    const newAmountPaid = [...amountPaid, paying];
    const newPaymentMethod = [...paymentMethod, selected];
    const result = +(due - paying).toFixed(2);

    setPayed(prev => {
      const total = Number(prev) + Number(paying);
      return +total.toFixed(2);
    });
    setAmountPaid(newAmountPaid);
    setPaymentMethod(newPaymentMethod);

    if (result === 0) {
      creation({
        paymentMethod: newPaymentMethod,
        amountPaid: newAmountPaid,
        change,
        discount,
        realizedAt: Date.now(),
      }, {
        onSuccess: () => {
          navigate("/pos");
          toast.success(t("toast.sales.finished"));
        },
        onError: (error) => {
          console.error(error);
          toast.error(t("toast.creation.error", { description: t("sales"), errorCause: error?.response?.data?.error }));
        }
      });
    } else if (result > 0) {
      setDue(result);
      toast.success(t("toast.discounted.value", { input: payed, due: result }));
    } else {
      setDue(0);
      setChange(Math.abs(result));
      toast.success(t("toast.change.value", { input: paying, change: Math.abs(result) }));
    }

    setPaying("");
  };

  const handleSale = () => {
    if (selected === "pay.later") {
      handlePendingDebtRegister();
    } else {
      updateBill();
    }
  };

  const changePayed = () => {
    creation({
      paymentMethod,
      amountPaid,
      change,
      realizedAt: Date.now(),
    }, {
      onSuccess: () => {
        navigate("/pos");
        toast.success(t("toast.sales.finished"));
      },
      onError: (error) => {
        console.error(error);
        toast.error(t("toast.creation.error", { description: t("sales"), errorCause: error?.response?.data?.error }));
      }
    });
  };

  const closeRegisterDue = () => {
    setOpenRegisterDue(false);
    inputRef.current?.focus();
  };

  const updateBillWithDiscounts = () => {
    setDue(total - discount)
    setPaying("");
    setOpenDiscount(false)
  }

  const paymentInput = (e) => {
    setPaying(e.target.value)
  }

  const discountInput = (e) => {
    setDiscount(e.target.value)
  }


  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section
        aria-labelledby="totals-heading"
        className="p-5 bg-gray-200 rounded-xl shadow-xl"
      >
        <h2 id="totals-heading" className="text-lg font-semibold text-gray-800 text-center">
          {t("sales.summary")}
        </h2>

        <div className="mt-3 space-y-2 text-center">
          <div className="text-base sm:text-lg font-bold text-red-600">
            {t("sales.final.bill")}: {t("currency")} {displayValue(total)}
          </div>
          <div className="text-base sm:text-lg font-bold text-green-600">
            {t("payed")}: {t("currency")} {displayValue(payed)}
          </div>
          {discount && <div className="text-base sm:text-lg font-bold text-yellow-600">
            {t("discount")}: {t("currency")} {discount}
          </div>}
          <div className="mt-2">
            {change === 0 ? (
              <div className="text-base sm:text-lg font-bold text-blue-600">
                {t("due")}: {t("currency")} {displayValue(due)}
              </div>
            ) : (
              <ActionButton type="button" bgColor="[rgba(98,70,234)]" text={t("toast.change.value", { input: displayValue(payed), change: displayValue(change) })} onClick={changePayed} icon={HandCoins} additionalStyle="sm:w-auto inline-flex items-center justify-center" />
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="payment-options" className="p-5 bg-gray-200 rounded-xl shadow-xl">
        <OptionsRange text={t("sales.payment.options")} options={options} selected={selected} setSelected={setSelected} />
      </section>

      <section className="p-5 bg-gray-200 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 gap-3">
          <label className="block">
            <MoneyInput icon={Banknote} type="number" value={paying} onChange={paymentInput} label={t("sales.payed") + " " + t("currency") + " (F6)"} textSize="text-4xl" inputRef={btnRefs.f6} />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <ActionButton type="button" bgColor="[rgba(98,70,234)]" text={t("discount") + " (F7)"} onClick={() => setOpenDiscount(true)} icon={BanknoteArrowDown} disabled={due === 0 || change > 0 || payed > 0} ref={btnRefs.f7} />
            <ActionButton type="button" bgColor="[rgba(98,70,234)]" text={t("total.value") + " (F8)"} onClick={setTotalValueForPay} icon={BadgeDollarSign} disabled={due === 0 || change > 0} ref={btnRefs.f8} />
            <ActionButton type="button" bgColor="red-600" text={t("receive") + " (F9)"} onClick={handleSale} icon={HandCoins} disabled={(paying ?? 0) === 0 || paying == "" || change > 0} ref={btnRefs.f9} />
          </div>
        </div>
      </section>

      <Modal
        title={t("sales.select.customer")}
        isOpen={isOpenRegisterDue}
        onClose={closeRegisterDue}
        closeButtonRef={btnRefs.Escape}
      >
        <CustomerList
          renderExpandedDiv={(customer, isExpanded) => (
            <CustomerAddDue
              updateBill={updateBill}
              onClose={closeRegisterDue}
              customer={customer}
              due={paying}
              isExpanded={isExpanded}
            />
          )}
        />
      </Modal>

      <Modal
        title={t("discount")}
        isOpen={isOpenDiscount}
        onClose={() => setOpenDiscount(false)}
        closeButtonRef={btnRefs.Escape}
      >
        <AddDiscount
          updateBill={updateBillWithDiscounts}
          handleDiscount={discountInput}
          discount={discount}
          closeButtonRef={btnRefs.Escape}
        />
      </Modal>

    </div>
  );
}