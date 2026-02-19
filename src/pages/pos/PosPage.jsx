import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { fetchProductBySmartCode } from "../../shared/hooks/useProducts";
import ProductList from "../product/ProductList";
import ProductAddToCart from "../product/ProductAddToCart";
import DeleteItem from "./DeleteItem";
import Modal from "../../components/Modal";
import ActionStrip from "../../components/ActionStrip";
import cashier from "../../assets/images/cashier.png";
import { useCart } from "../../hooks/useCart";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useBarcodeScanner } from "../../hooks/useBarcodeScanner";
import CartTable from "../../components/CartTable";
import playBeepSound from "../../shared/utils/playBeepSound";


const PosPage = ({ onScan: onScanProp, postToBackend = true, fetchProductBySmartCodeMutate }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    mutate: getProduct,
    isLoading: isLoading,
  } = fetchProductBySmartCode();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const inputRef = useRef(null);
  const refs = useMemo(() => ({ f1: React.createRef(), f2: React.createRef(), f3: React.createRef(), f4: React.createRef(), f6: React.createRef(), f7: React.createRef() }), []);

  const [isFocusActive, setFocusActive] = useState(true);
  const [lastScan, setLastScan] = useState(null);
  const [isBeepEnabled, setBeepEnabled] = useState(true);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setDeleteItemModalOpen] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useKeyboardShortcuts({
    F1: () => refs.f1.current?.click(),
    F2: () => refs.f2.current?.click(),
    F3: () => refs.f3.current?.click(),
    F4: () => refs.f4.current?.click(),
    F6: () => refs.f6.current?.click(),
    Escape: () => refs.f7.current?.click(),
  });

  const { items: scans, total: bill, add, removeAt, clear } = useCart();

  const handleScan = useCallback(
    (code) => {

      setLastScan(code);
      onScanProp?.(code);
      playBeepSound(isBeepEnabled);

      if (!code) return;

      if (postToBackend) {
        getProduct(code, {
          onSuccess: (data) => {
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

      add({ code, name: code, price: 0 });
    },
    [add, fetchProductBySmartCodeMutate, isBeepEnabled, onScanProp, postToBackend, t]
  );

  useBarcodeScanner({ inputRef, enabled: isFocusActive, onScan: handleScan, debounceMs: 200, playBeep: () => playBeepSound(isBeepEnabled) });

  const addedManually = useCallback((productSelected) => {
    setFocusActive(true);
    add(
      {
        code: productSelected.smartCode,
        name: productSelected.name,
        price: parseFloat(productSelected.priceForSale || 0),
        quantity: productSelected.quantity || 1
      }
    );
    toast.success(t("toast.add.to.cart", { description: `${productSelected.name} - ${t("currency")}${productSelected.priceForSale}` }));
    setSearchModalOpen(false);
    inputRef.current?.focus();
  }, [add, t]);

  const handleDelete = useCallback((index) => {
    const item = scans[index];
    removeAt(index);
    toast.success(t("toast.remove.from.cart", { description: `${item.name} - ${t("currency")}${item.price}` }));
    setDeleteItemModalOpen(false);
    setFocusActive(true);
    inputRef.current?.focus();
  }, [removeAt, scans, t]);

  const cleanSales = useCallback(() => {
    clear();
    setLastScan(null);
    toast.info(t("toast.clean.success"));
  }, [clear, t]);

  const cleanSalesInformation = useCallback(() => {
    if (confirm(t("confirm.clean.sale"))) {
      cleanSales();
    }
  }, [cleanSales, t]);

  const openPaymentModal = useCallback(() => {
    if (bill > 0) {
      setFocusActive(false);
      // navigate(`/payment?total=${bill}`);
      navigate("/payment", {
        state: {
          total: bill,
          products: scans, // sua lista de produtos
        },
      });
    } else {
      toast.error(t("toast.cart.empty"));
    }
  }, [bill, navigate, t]);

  const openSearchModal = useCallback(() => { setFocusActive(false); setSearchModalOpen(true); }, []);
  const openDeleteItemModal = useCallback(() => {
    if (bill > 0) { setFocusActive(false); setDeleteItemModalOpen(true); }
    else toast.error(t("toast.cart.empty"));
  }, [bill, t]);

  const toggleBeep = useCallback(() => setBeepEnabled((s) => !s), []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-slate-900 dark:text-slate-100 p-3 sm:p-4 text-2xl">
      <header className="flex items-center gap-3 mb-3">
        <img src={cashier} alt="Caixa" className="w-10 h-10" />
        <div>
          <h1 className="text-xl font-bold">{t("pos.title")}</h1>
        </div>
      </header>
      <main className="space-y-3">

        <section className="flex justify-between text-base">
          <div className="font-semibold">
            {t("pos.last.product.read")}
            <span className="font-mono text-green-600 text-md p-2">
              {lastScan || t("pos.waiting") || "Aguardando..."}
            </span>
          </div>
          <div className="font-semibold text-md">
            {t("pos.total.inside.cart")}
            <span className="font-mono text-green-600 p-2">{scans.length}</span>
          </div>
        </section>


        <CartTable items={scans} onRemove={handleDelete} />
        <ActionStrip refs={refs} onFinalize={openPaymentModal} onManualAdd={openSearchModal} onClean={cleanSalesInformation} onOpenDelete={openDeleteItemModal} total={bill} isBeepEnabled={isBeepEnabled} toggleBeep={toggleBeep} />

      </main>

      <input
        ref={inputRef}
        type="text"
        aria-label="Barcode input"
        onBlur={() => { if (isFocusActive) setTimeout(() => inputRef.current?.focus(), 100) }}
        style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
      />

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