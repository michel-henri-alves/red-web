import React, { useCallback, useEffect, useMemo, useRef, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchProductBySmartCode } from "../../shared/hooks/useProducts";
import ProductList from "../product/ProductList";
import ProductAddToCart from "../product/ProductAddToCart";
import DeleteItem from "./DeleteItem";
import Modal from "../../components/Modal";
import ActionButton from "../../components/ActionButton";
import cashier from "../../assets/images/cashier.png";

/**
 * PosPage.refactor.jsx
 * - Arquitetura profissional (single-file export for convenience)
 * - Hooks customizados: useCart, useBarcodeScanner, useKeyboardShortcuts
 * - Serviços: productService (local wrapper around mutation)
 * - Componentes pequenos: ActionStrip, CartTable, HiddenBarcodeInput
 *
 * Nota: adicionei comentários para facilitar extração em múltiplos arquivos.
 */

/* ---------- productService (ponto único para chamadas ao backend) ---------- */
const productService = {
  fetchBySmartCode: async (code) => {
    // Aqui chamamos a função que você já tem (
    // fetchProductBySmartCode) — em produção, substitua por chamada real
    // Exemplo: return api.get(`/products?smartCode=${code}`)
    // Para manter compatibilidade com seu hook, assumimos que o hook
    // original expõe um mutate-like; aqui devolvemos o shape esperado.
    // OBS: o componente que usar este serviço ainda continuará a usar
    // a mutate original se preferir.
    throw new Error("productService.fetchBySmartCode: implementar chamada real");
  },
};

const sendToBackend = async (code) => {
  getProduct(code, {
    onSuccess: (data) => {
      if (data !== undefined && data !== null) {
        setScans((prev) => [
          { code, name: data.name, price: data.priceForSale },
          ...prev,
        ]);
        setLastScan(data.name)
        setBill((prevBill) => prevBill + parseFloat(data.priceForSale));
        inputRef.current.value = '';
        inputRef.current?.focus();

      } else {
        setLastScan(t("pos.code.unregistered", { "code": code }))
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

/* ---------------------- util helpers ---------------------- */
const formatCurrency = (v) => {
  if (v == null || Number.isNaN(Number(v))) return "R$ 0,00";
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const playBeepSound = (enabled) => {
  if (!enabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = 600;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    // ignore
  }
};

/* ---------------------- useCart hook ---------------------- */
const CART_ACTIONS = {
  ADD: "ADD",
  REMOVE_AT: "REMOVE_AT",
  CLEAR: "CLEAR",
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const item = action.payload;
      const newScans = [item, ...state.scans];
      const newBill = Number(state.bill) + Number(item.price || 0);
      return { ...state, scans: newScans, bill: newBill };
    }
    case CART_ACTIONS.REMOVE_AT: {
      const i = action.payload;
      if (i < 0 || i >= state.scans.length) return state;
      const removed = state.scans[i];
      const scans = state.scans.filter((_, idx) => idx !== i);
      const bill = Number(state.bill) - Number(removed.price || 0);
      return { ...state, scans, bill: bill < 0 ? 0 : bill };
    }
    case CART_ACTIONS.CLEAR:
      return { scans: [], bill: 0 };
    default:
      return state;
  }
}

const useCart = (initial = { scans: [], bill: 0 }) => {
  const [state, dispatch] = useReducer(cartReducer, initial);

  const add = useCallback((item) => dispatch({ type: CART_ACTIONS.ADD, payload: item }), []);
  const removeAt = useCallback((index) => dispatch({ type: CART_ACTIONS.REMOVE_AT, payload: index }), []);
  const clear = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR }), []);

  const total = useMemo(() => state.bill, [state.bill]);
  const items = useMemo(() => state.scans, [state.scans]);

  return { items, total, add, removeAt, clear };
};

/* ---------------------- useKeyboardShortcuts hook ---------------------- */
// small abstraction around keyboard shortcuts; you can replace with library if desired
const useKeyboardShortcuts = (map) => {
  useEffect(() => {
    const handler = (e) => {
      const key = e.key;
      if (map[key]) {
        e.preventDefault();
        map[key]();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [map]);
};

/* ---------------------- useBarcodeScanner hook ---------------------- */
const useBarcodeScanner = ({ enabled = true, onScan, timeout = 100 }) => {
  const buffer = useRef("");
  const timer = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      if (timer.current) clearTimeout(timer.current);

      // Ignora teclas especiais (shift, ctrl, etc)
      if (e.key.length === 1) {
        buffer.current += e.key;
      }

      // Quando a digitação parar, dispara o scan
      timer.current = setTimeout(() => {

        if (buffer.current.length >= 5) { // evita interferência de digitação rápida humana
          onScan?.(buffer.current);
        }
        buffer.current = "";
      }, timeout);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onScan, timeout]);
};

/* ---------------------- Small presentational components ---------------------- */
const ActionStrip = React.memo(({ refs, onFinalize, onManualAdd, onClean, onOpenDelete, total, isBeepEnabled, toggleBeep }) => {
  const { t } = useTranslation();
  return (
    <section className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <ActionButton text={t("button.finalize.sale") + " (F1)"} icon="💰" bgColor="green" onClick={onFinalize} ref={refs.f1} />
        <ActionButton text={t("button.insert.manually") + " (F2)"} icon="✍️" bgColor="blue" onClick={onManualAdd} ref={refs.f2} />
        <ActionButton text={t("button.clean") + " (F3)"} icon="🧹" bgColor="cyan" onClick={onClean} ref={refs.f3} />
        <ActionButton text={t("button.clean") + " (F4)"} icon="🗑️" bgColor="red" onClick={onOpenDelete} ref={refs.f4} />
      </div>

      <div className="flex items-center gap-3 justify-between sm:justify-end">
        <div className="bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-2 text-lg font-mono font-bold">
          <div className="text-xs text-gray-500 dark:text-gray-300">{t("pos.bill.total")}</div>
          <div className="text-2xl text-green-600 dark:text-green-400">{formatCurrency(total)}</div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-300 mr-1">{t("sound")}</label>
          <div className="flex items-center gap-2">
            <input ref={refs.f6} type="checkbox" checked={isBeepEnabled} onChange={toggleBeep} className="w-5 h-5 rounded" />
            <span>{isBeepEnabled ? "🎶" : "🔇"}</span>
          </div>
        </div>

      </div>
    </section>
  );
});

const CartTable = ({ items, onRemove }) => {
  const { t } = useTranslation();
  return (
    <section className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900 sticky top-0">
            <tr>
              <th className="py-2 px-2 w-10">#</th>
              <th className="py-2 px-2"> {t("product.name")} </th>
              <th className="py-2 px-2 w-32"> {t("product.priceForSale")} </th>
              <th className="py-2 px-2 w-28"> {t("actions")} </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 px-4 text-center text-gray-500">{t("pos.no.items") || "Nenhum item adicionado"}</td>
              </tr>
            ) : (
              items.map((scan, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-900 transition">
                  <td className="py-2 px-2 align-top">{i + 1}</td>
                  <td className="py-2 px-2 align-top break-words">{scan.name}</td>
                  <td className="py-2 px-2 align-top">{formatCurrency(scan.price)}</td>
                  <td className="py-2 px-2 align-top">
                    <ActionButton icon="🗑️" bgColor="red" onClick={() => onRemove(i)} />
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

const HiddenBarcodeInput = ({ inputRef, isFocusActive, keepFocus = true }) => {
  useEffect(() => {
    if (!isFocusActive) return;
    const el = inputRef.current;
    if (!el) return;
    el.focus();
  }, [isFocusActive]);

  return (
    <input
      ref={inputRef}
      type="text"
      aria-label="Barcode input"
      autoFocus
      className="opacity-0 absolute -z-10 pointer-events-none"
      onBlur={() => {
        if (isFocusActive) {
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }}
    />
  );
};

/* ---------------------- Main PosPage component ---------------------- */
const PosPage = ({ onScan: onScanProp, postToBackend = true, fetchProductBySmartCodeMutate }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();


  const {
    mutate: getProduct,
    isLoading: isLoading,
  } = fetchProductBySmartCode(); useEffect(() => {
    inputRef.current?.focus(); // foca ao montar a tela
  }, []);

  // refs for keyboard shortcuts and input
  const inputRef = useRef(null);
  const refs = useMemo(() => ({ f1: React.createRef(), f2: React.createRef(), f3: React.createRef(), f4: React.createRef(), f6: React.createRef(), f7: React.createRef() }), []);

  // UI state
  const [isFocusActive, setFocusActive] = useState(true);
  const [lastScan, setLastScan] = useState(null);
  const [isBeepEnabled, setBeepEnabled] = useState(true);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setDeleteItemModalOpen] = useState(false);

  useEffect(() => {
    inputRef.current?.focus(); // foca ao montar a tela
  }, []);

  // cart hook
  const { items: scans, total: bill, add, removeAt, clear } = useCart();

  // keyboard shortcuts wiring
  useKeyboardShortcuts({
    F1: () => refs.f1.current?.click(),
    F2: () => refs.f2.current?.click(),
    F3: () => refs.f3.current?.click(),
    F4: () => refs.f4.current?.click(),
    F6: () => refs.f6.current?.click(),
    Escape: () => refs.f7.current?.click(),
  });

  // handle scan: unify local actions and backend call
  const handleScan = useCallback(
    (code) => {

      setLastScan(code);
      onScanProp?.(code);
      playBeepSound(isBeepEnabled);

      if (!code) return;

      if (postToBackend) {
        // prefer injected mutate (keeps compatibility with your existing hook)
        getProduct(code, {
          onSuccess: (data) => {
            console.log("dados: ", data)
            if (data) {
              add({ code, name: data.name, price: parseFloat(data.priceForSale || 0) });
              setLastScan(data.name);

            } else {
              setLastScan(t("pos.code.unregistered", { code }));
            }
          },
          onError: (err) => {
            console.error(err);
            toast.error(t("toast.api.error") || "Erro ao consultar produto");
          },
        });

        inputRef.current.value = "";

        return;
      }

      // fallback: if no backend, just add code as 'unknown' product
      add({ code, name: code, price: 0 });
    },
    [add, fetchProductBySmartCodeMutate, isBeepEnabled, onScanProp, postToBackend, t]
  );

  // barcode scanner hook
  useBarcodeScanner({ inputRef, enabled: isFocusActive, onScan: handleScan, debounceMs: 200, playBeep: () => playBeepSound(isBeepEnabled) });

  // manual add from modal
  const addedManually = useCallback((productSelected) => {
    setFocusActive(true);
    add({ code: productSelected.smartCode, name: productSelected.name, price: parseFloat(productSelected.priceForSale || 0) });
    toast.success(t("toast.add.to.cart", { description: `${productSelected.name} - ${t("currency")}${productSelected.priceForSale}` }));
    setSearchModalOpen(false);
    inputRef.current?.focus();
  }, [add, t]);

  // delete item handler
  const handleDelete = useCallback((index) => {
    const item = scans[index];
    removeAt(index);
    toast.success(t("toast.remove.from.cart", { description: `${item.name} - ${t("currency")}${item.price}` }));
    setDeleteItemModalOpen(false);
    setFocusActive(true);
    inputRef.current?.focus();
  }, [removeAt, scans, t]);

  // clean
  const cleanSales = useCallback(() => {
    clear();
    setLastScan(null);
    toast.info(t("toast.clean.success") || "Venda limpa");
  }, [clear, t]);

  const cleanSalesInformation = useCallback(() => {
    if (confirm(t("confirm.clean.sale") || "Tem certeza que deseja limpar os dados dessa venda?")) {
      cleanSales();
    }
  }, [cleanSales, t]);

  // payment
  const openPaymentModal = useCallback(() => {
    if (bill > 0) {
      setFocusActive(false);
      navigate(`/payment?total=${bill}`);
    } else {
      toast.error(t("toast.cart.empty"));
    }
  }, [bill, navigate, t]);

  // other modal openers
  const openSearchModal = useCallback(() => { setFocusActive(false); setSearchModalOpen(true); }, []);
  const openDeleteItemModal = useCallback(() => {
    if (bill > 0) { setFocusActive(false); setDeleteItemModalOpen(true); }
    else toast.error(t("toast.cart.empty"));
  }, [bill, t]);

  // toggle beep
  const toggleBeep = useCallback(() => setBeepEnabled((s) => !s), []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-slate-100 p-3 sm:p-4 text-2xl">
      {/* Header */}
      <header className="flex items-center gap-3 mb-3">
        <img src={cashier} alt="Caixa" className="w-10 h-10" />
        <div>
          <h1 className="text-xl font-bold">{t("pos.title")}</h1>
        </div>
      </header>

      <main className="space-y-3">
        <ActionStrip refs={refs} onFinalize={openPaymentModal} onManualAdd={openSearchModal} onClean={cleanSalesInformation} onOpenDelete={openDeleteItemModal} total={bill} isBeepEnabled={isBeepEnabled} toggleBeep={toggleBeep} />

        <section className="text-base">
          <div className="font-semibold">{t("pos.last.product.read")} : <span className="font-mono text-green-600">{lastScan || t("pos.waiting") || "Aguardando..."}</span></div>
        </section>

        <CartTable items={scans} onRemove={handleDelete} />

        {/* Responsive Action Bar for Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex justify-around py-2 z-50 shadow-lg">
          <button onClick={openPaymentModal} className="flex-1 mx-1 px-3 py-2 bg-green-600 text-white rounded-md font-semibold text-sm" aria-label="Finalizar venda">💰 Finalizar</button>
          <button onClick={openSearchModal} className="flex-1 mx-1 px-3 py-2 bg-orange-500 text-white rounded-md font-semibold text-sm" aria-label="Inserir item manualmente">✍️ Inserir</button>
          <button onClick={cleanSalesInformation} className="flex-1 mx-1 px-3 py-2 bg-cyan-600 text-white rounded-md font-semibold text-sm" aria-label="Limpar venda">🧹 Limpar</button>
          <button onClick={openDeleteItemModal} className="flex-1 mx-1 px-3 py-2 bg-red-600 text-white rounded-md font-semibold text-sm" aria-label="Excluir item">🗑️ Excluir</button>
        </div>

      </main>

      <input
        ref={inputRef}
        type="text"
        aria-label="Barcode input"
        onBlur={() => { if (isFocusActive) setTimeout(() => inputRef.current?.focus(), 100) }}
        style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
      />

      {/* Modals */}
      <Modal title={t("pos.find.product")} isOpen={isSearchModalOpen} onClose={() => { setSearchModalOpen(false); setFocusActive(true); inputRef.current?.focus(); }} closeButtonRef={refs.f7}>
        <ProductList renderExpandedDiv={(product, isExpanded) => <ProductAddToCart product={product} isExpanded={isExpanded} addToCartMethod={addedManually} />} />
      </Modal>

      <Modal title={t("button.delete.item")} isOpen={isDeleteItemModalOpen} onClose={() => { setDeleteItemModalOpen(false); setFocusActive(true); inputRef.current?.focus(); }} closeButtonRef={refs.f7}>
        <DeleteItem handleDelete={(index) => handleDelete(index)} />
      </Modal>

    </div>
  );
};

export default PosPage;
