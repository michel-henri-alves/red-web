import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { createSale } from '../../../shared/hooks/useSales';
import { useKeyboardShortcut } from "../../../hooks/useKeyboardShortcut";
import { useNavigate } from "react-router-dom";
import FormInput from '../../../components/FormInput';
import Modal from '../../../components/Modal';
import CustomerList from '../../customer/CustomerList';
import CustomerAddDue from './CustomerAddDue';

export default function Payment({ total }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // --- API hook (mutation) ---
  const {
    mutate: creation,
    isLoading: isLoadingCreation,
    // kept fields available if needed: isSuccess, isError, error, reset
  } = createSale();

  // --- states ---
  const [payed, setPayed] = useState(0);
  const [paying, setPaying] = useState(0);
  const [due, setDue] = useState(total ?? 0);
  const [change, setChange] = useState(0);
  const [discount] = useState(0); // não usado na lógica atual, mantido
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [amountPaid, setAmountPaid] = useState([]);
  const [isOpenRegisterDue, setOpenRegisterDue] = useState(false);

  // --- refs (keyboard shortcuts) ---
  // Criamos 6 refs e os atalhos F1..F6 disparam click nos elementos correspondentes.
  const btnRefs = Array.from({ length: 6 }).map(() => useRef(null));
  ["F1", "F2", "F3", "F4", "F5", "F6"].forEach((key, idx) =>
    useKeyboardShortcut([key], () => btnRefs[idx]?.current?.click())
  );

  const inputRef = useRef(null);

  // --- escolha de método ---
  const [selected, setSelected] = useState("debit");

  const options = [
    { label: t("debit"), value: "debit", colorClass: "bg-red-500", icon: "💳", ref: btnRefs[0] },
    { label: t("credit"), value: "credit", colorClass: "bg-green-500", icon: "💳", ref: btnRefs[1] },
    { label: t("money"), value: "money", colorClass: "bg-yellow-500", icon: "💵", ref: btnRefs[2] },
    { label: t("pix"), value: "pix", colorClass: "bg-cyan-500", icon: "❖", ref: btnRefs[3] },
    { label: t("pay.later"), value: "pay.later", colorClass: "bg-blue-500", icon: "📝", ref: btnRefs[4] },
  ];

  // --- helper: format number to 2 decimals for display ---
  const displayValue = (num) => {
    if (typeof num !== 'number' || isNaN(num)) return "0.00";
    return num.toFixed(2);
  };

  // --- input change: recebe string, remove não dígitos e divide por 100 (mantém sua lógica original) ---
  const handleChange = (e) => {
    // aceitável receber "." e "," do usuário; normalizamos para apenas dígitos aqui
    const raw = String(e.target.value);
    const digits = raw.replace(/\D/g, "");
    const value = digits ? parseFloat(digits) / 100 : 0;
    setPaying(value);
  };

  // mantemos comportamento de selecionar fim do input ao payed mudar
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

  // --- funções principais ---
  const setTotalValueForPay = () => {
    setPaying(due);
  };

  const handlePendingDebtRegister = () => {
    setOpenRegisterDue(true);
  };

  const updateBill = () => {
    // registra pagamento parcial/total
    const newAmountPaid = [...amountPaid, paying];
    const newPaymentMethod = [...paymentMethod, selected];
    const result = +(due - paying).toFixed(2); // evitar imprecisão flutuante

    setPayed(prev => +(prev + paying).toFixed(2));
    setAmountPaid(newAmountPaid);
    setPaymentMethod(newPaymentMethod);

    if (result === 0) {
      // pagamento finalizado
      creation({
        paymentMethod: newPaymentMethod,
        amountPaid: newAmountPaid,
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
    } else if (result > 0) {
      // ficou valor a receber (desconto/valor restante)
      setDue(result);
      toast.success(t("toast.discounted.value", { input: payed, due: result }));
    } else {
      // troco
      setDue(0);
      setChange(Math.abs(result));
      toast.success(t("toast.change.value", { input: paying, change: Math.abs(result) }));
    }

    // limpa campo de entrada
    setPaying(0);
  };

  const handleSale = () => {
    if (selected === "pay.later") {
      handlePendingDebtRegister();
    } else {
      updateBill();
    }
  };

  const changePayed = () => {
    // confirma venda quando há troco exibido
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
    // opcional: focar input novamente
    inputRef.current?.focus();
  };

  // --- renderização (mobile-first) ---
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* CARD: totais */}
      <section
        aria-labelledby="totals-heading"
        className="p-4 bg-white rounded-xl shadow-sm"
      >
        <h2 id="totals-heading" className="text-lg font-semibold text-gray-800 text-center">
          {t("sales.final.bill")}
        </h2>

        <div className="mt-3 space-y-2 text-center">
          <div className="text-base sm:text-lg font-bold text-red-600">
            {t("sales.bill.total")}: {t("currency")} {displayValue(total)}
          </div>
          <div className="text-base sm:text-lg font-bold text-green-600">
            {t("payed")}: {t("currency")} {displayValue(payed)}
          </div>
          <div className="text-base sm:text-lg font-bold text-yellow-600">
            {t("discount")}: {t("currency")} {displayValue(discount)}
          </div>

          <div className="mt-2">
            {change === 0 ? (
              <div className="text-base sm:text-lg font-bold text-blue-600">
                {t("due")}: {t("currency")} {displayValue(due)}
              </div>
            ) : (
              <button
                type="button"
                onClick={changePayed}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-orange-500 text-white font-medium shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                aria-label={t("toast.change.value", { input: displayValue(payed), change: displayValue(change) })}
              >
                {t("toast.change.value", { input: displayValue(payed), change: displayValue(change) })}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CARD: opções de pagamento */}
      <section aria-labelledby="payment-options" className="p-4 bg-white rounded-xl shadow-sm">
        <h3 id="payment-options" className="text-base font-semibold text-gray-800 text-center">
          {t("sales.payment.options")}
        </h3>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {options.map((option, idx) => {
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                ref={option.ref}
                type="button"
                onClick={() => setSelected(option.value)}
                aria-pressed={isSelected}
                aria-label={option.label}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium transition-transform 
                  ${option.colorClass} ${isSelected ? "ring-2 ring-offset-2 ring-blue-500 scale-105" : "hover:scale-102"}
                `}
              >
                <span className="text-xl" aria-hidden>{option.icon}</span>
                <span className="truncate">{option.label}</span>
                <span className="sr-only">{isSelected ? t("selected") : ""}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* CARD: entrada de valor + ações */}
      <section className="p-4 bg-white rounded-xl shadow-sm">
        <div className="grid grid-cols-1 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">{t("sales.payed")}</span>
            {/* Usamos input text para permitir máscara/local-format, mas o handleChange normaliza */}
            <input
              ref={inputRef}
              value={displayValue(paying)}
              onChange={handleChange}
              inputMode="numeric"
              aria-label={t("sales.payed")}
              className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-300 px-3 py-2 text-right"
              placeholder="0.00"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={setTotalValueForPay}
              disabled={change > 0}
              className={`w-full sm:w-1/3 inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
                ${change > 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400"}`}
              aria-disabled={change > 0}
            >
              ➤ {t("autocomplete")}
            </button>

            <button
              type="button"
              onClick={handleSale}
              disabled={paying === 0 || change > 0}
              className={`w-full sm:w-1/3 inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
                ${paying === 0 || change > 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400"}`}
              aria-disabled={paying === 0 || change > 0}
            >
              🤝 {t("receive")}
            </button>

            <button
              type="button"
              onClick={handleSale}
              disabled={paying === 0 || change > 0}
              className={`w-full sm:w-1/3 inline-flex items-center justify-center px-4 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
                ${paying === 0 || change > 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400"}`}
              aria-disabled={paying === 0 || change > 0}
            >
              💸 {t("discount")}
            </button>
          </div>
        </div>
      </section>

      {/* MODAL: registrar dívida */}
      <Modal
        title={t("sales.select.customer")}
        isOpen={isOpenRegisterDue}
        onClose={closeRegisterDue}
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
    </div>
  );
}