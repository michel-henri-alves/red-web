import { useEffect, useRef, useState } from 'react';
import { fetchProductBySmartCode } from "../../shared/hooks/useProducts";
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify';
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import { useNavigate } from "react-router-dom";

import ProductList from '../product/ProductList';
import ProductAddToCart from '../product/ProductAddToCart';
import DeleteItem from '../pos/DeleteItem';
import Modal from "../../components/Modal";


const PosPage = ({ onScan, postToBackend = true }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();


    const {
        mutate: getProduct,
        isLoading: isLoading,
        isSuccess: isSuccess,
        isError: isError,
        error: error,
        reset: reset,
    } = fetchProductBySmartCode();
    const inputRef = useRef(null);
    const [isFocusActive, setFocusActive] = useState(true);
    const [lastScan, setLastScan] = useState(null);
    const [scans, setScans] = useState([]);
    const [bill, setBill] = useState(0);
    const [isBeepEnabled, setBeepEnabled] = useState(true);
    const [isSearchModalOpen, setSearchModalOpen] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [isDeleteItemModalOpen, setDeleteItemModalOpen] = useState(false);

    const btn1Ref = useRef(null);
    const btn2Ref = useRef(null);
    const btn3Ref = useRef(null);
    const btn4Ref = useRef(null);
    const btn5Ref = useRef(null);
    const btn6Ref = useRef(null);
    const btn7Ref = useRef(null);



    useKeyboardShortcut(["F1"], () => {
        btn1Ref.current?.click();
    });


    useKeyboardShortcut(["F2"], () => {
        btn2Ref.current?.click();
    });


    useKeyboardShortcut(["F3"], () => {
        btn3Ref.current?.click();
    });


    useKeyboardShortcut(["F4"], () => {
        btn4Ref.current?.click();
    });

    useKeyboardShortcut(["F6"], () => {
        btn5Ref.current?.click();
    });

    useKeyboardShortcut(["F7"], () => {
        btn6Ref.current?.click();
    });

    useKeyboardShortcut(["Escape"], () => {
        btn7Ref.current?.click();
    });


    const closePaymentModal = () => {
        setPaymentModalOpen(false);
        setFocusActive(true);
        inputRef.current?.focus();
    }

    const closeSearchModal = () => {
        setSearchModalOpen(false);
        setFocusActive(true);
        inputRef.current?.focus();
    }

    const closeDeleteItemModal = () => {
        setDeleteItemModalOpen(false);
        setFocusActive(true);
        inputRef.current?.focus();
    }

    const openPaymentModal = () => {
        if (bill !== 0) {
            setFocusActive(false);
            // setPaymentModalOpen(true);
            console.log("5555555 {}", bill)
            // navigate("/payment", { state: { bill } });
            navigate(`/payment?total=${bill}`);



        } else {
            toast.error(t("toast.cart.empty"));
        }
    }

    const openSearchModal = () => {
        setFocusActive(false);
        setSearchModalOpen(true);
    }

    const openDeleteItemModal = () => {
        if (bill !== 0) {

            setFocusActive(false);
            setDeleteItemModalOpen(true);
        } else {
            toast.error(t("toast.cart.empty"));
        }
    }


    const [lastTimestamp, setLastTimestamp] = useState(0);

    const cleanSalesInformation = () => {

        const confirmed = window.confirm('Tem certeza que deseja limpar os dados dessa venda?');
        if (confirmed) {
            cleanSales();
        }
    }

    const cleanSales = () => {
        setBill(0);
        setScans([]);
        setLastScan(null);
    }

    const handleDelete = (index) => {

        var productForDelete = scans[index];
        console.log(JSON.stringify(productForDelete))

        setScans((prev) => prev.filter((_, i) => i !== index));
        setBill((prevBill) => prevBill - parseFloat(productForDelete.price));
        toast.success(t("toast.remove.from.cart", { description: productForDelete.name + " - " + t("currency") + productForDelete.price }));

    };

    // 🔊 Som de confirmação
    const playBeep = () => {
        if (isBeepEnabled) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            osc.type = 'square';
            osc.frequency.value = 600;
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        }
    };

    // 📤 Enviar para o backend
    const sendToBackend = async (code) => {
        console.log("codigo de barras: " + code)
        getProduct(code, {
            onSuccess: (data) => {
                console.log(data)
                if (data !== undefined && data !== null) {
                    setScans((prev) => [
                        { code, name: data.name, price: data.priceForSale },
                        ...prev,
                    ]);
                    setLastScan(data.name)
                    setBill((prevBill) => prevBill + parseFloat(data.priceForSale));
                } else {
                    setLastScan(t("sales.code.unregistered", { "code": code }))
                }
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    const addedManually = (productSelected) => {
        closeSearchModal()
        setScans((prev) => [
            { code: productSelected.smartCode, name: productSelected.name, price: productSelected.priceForSale },
            ...prev,
        ]);
        setBill((prevBill) => prevBill + parseFloat(productSelected.priceForSale));
        toast.success(t("toast.add.to.cart", { description: productSelected.name + " - " + t("currency") + productSelected.priceForSale }));
    }

    useEffect(() => {

        if (!isFocusActive) return;

        const input = inputRef.current;
        if (input) input.focus();

        const handleInput = (e) => {
            const code = e.target.value.trim();
            e.target.value = ''; // limpa para próxima leitura

            const now = Date.now();

            // Evita leituras duplicadas em milissegundos
            if (code && now - lastTimestamp > 200) {
                setLastTimestamp(now);
                setLastScan(code);

                playBeep();

                if (postToBackend) sendToBackend(code);
                if (onScan) onScan(code);
            }
        };

        input.addEventListener('change', handleInput);

        return () => input.removeEventListener('change', handleInput);
    }, [lastTimestamp, onScan, postToBackend]);

    return (
        <div
            className="relative  w-full h-full mx-auto p-4 rounded shadow"
            onClick={() => { if (isFocusActive) inputRef.current?.focus() }}
        >
            {/* <DraggableDiv children={
                <div className="bg-white shadow rounded px-4 py-2 text-green-600 font-bold text-xl font-mono border border-gray-200 z-50">
                    <div>
                        {t("sales.bill.total")}&nbsp;💲{bill.toFixed(2)}
                    </div>
                </div>
            } /> */}

            <div className="w-full bg-white dark:bg-gray-900 p-4 flex justify-between items-center rounded-xl shadow-2xl shadow-[4px_0_6px_rgba(0,0,0,0.25),0_4px_6px_rgba(0,0,0,0.25)]">

                <div className="flex gap-3">
                    <button className="p-2 px-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition text-lg flex items-center gap-1 cursor-pointer"
                        onClick={() => openPaymentModal()}
                        ref={btn1Ref}
                    >
                        💰 <span>{t("button.finalize.sale")} (F1)</span>
                    </button>
                    <button className="p-2 px-4 rounded-xl bg-orange-400 text-white font-bold hover:bg-orange-500 transition text-lg flex items-center gap-1 cursor-pointer"
                        onClick={() => openSearchModal()}
                        ref={btn2Ref}
                    >
                        ✍️ <span>{t("button.insert.manually")} (F2)</span>
                    </button>
                    <button className="p-2 px-4 rounded-xl bg-cyan-500 text-white font-bold hover:bg-cyan-600 transition text-lg flex items-center gap-1 cursor-pointer"
                        onClick={() => cleanSalesInformation()}
                        ref={btn3Ref}
                    >
                        🧹 <span>{t("button.clean")} (F3)</span>
                    </button>
                    <button className="p-2 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition text-lg flex items-center gap-1 cursor-pointer"
                        onClick={() => openDeleteItemModal()}
                        ref={btn4Ref}
                    >
                        🗑️ <span>{t("button.delete.item")} (F4)</span>
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <div className="bg-gray-100 shadow rounded px-4 py-2 text-green-600 font-bold text-2xl font-mono border border-gray-200 z-50">
                        <div>
                            {t("sales.bill.total")}&nbsp;💲{bill.toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-bold dark:text-gray-300">{t("sound")}  (F6)</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isBeepEnabled}
                            onChange={() => setBeepEnabled(!isBeepEnabled)}
                            className="sr-only peer"
                            ref={btn5Ref}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:bg-green-500 transition" />
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
                    </label>
                    <span className="text-lg">{isBeepEnabled ? "🎶" : "🔇"}</span>
                </div>
            </div>

            <input
                ref={inputRef}
                type="text"
                onBlur={() => { if (isFocusActive) setTimeout(() => inputRef.current?.focus(), 100) }}
                style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
            />
            <br />
            {/* <h2 className="text-xl font-bold mb-4">🛒 {t("sales.product.list")}</h2> */}

            <div className="mb-3 text-2xl font-bold">
                <span className="font-semibold">{t("sales.last.product.read")}:</span>{' '}
                <span className="text-green-600 font-mono">{lastScan || 'Aguardando...'}</span>
            </div>

            <div className="h-full w-full border rounded">
                <table className="min-w-full text-lg font-mono table-fixed">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="py-2 px-2 w-12 text-left">#</th>
                            <th className="py-2 px-2 text-left  text-2xl">{t('product.name')}</th>
                            <th className="py-2 px-2 text-left  text-2xl">{t('product.priceForSale')}</th>
                            <th className="py-2 px-2 text-left  text-2xl">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scans.map((scan, i) => (
                            <tr key={i} className="border-b border-gray-300">
                                <td className="py-1 px-2 text-xl">{i + 1}</td>
                                <td className="py-1 px-2 break-all text-xl">{scan.name}</td>
                                <td className="py-1 px-2 break-all text-xl">{scan.price}</td>
                                <td className="py-1 px-2">
                                    <button
                                        onClick={() => handleDelete(i)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                                        title={t("button.tooltip.delete")}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title={t("sales.find.product")}
                isOpen={isSearchModalOpen}
                onClose={closeSearchModal}
                closeButtonRef={btn7Ref}>
                <ProductList
                    renderExpandedDiv={(product, isExpanded) => <ProductAddToCart product={product} isExpanded={isExpanded} addToCartMethod={addedManually} />}
                />
            </Modal>

            {/* <Modal
                title={t("sales.payment")}
                isOpen={isPaymentModalOpen}
                onClose={closePaymentModal}
                closeButtonRef={btn7Ref}>
                <PaymemtOptions total={bill} onClose={closePaymentModal} cleanSale={cleanSales} />
            </Modal> */}

            <Modal
                title={t("button.delete.item")}
                isOpen={isDeleteItemModalOpen}
                onClose={closeDeleteItemModal}
                closeButtonRef={btn7Ref}>
                <DeleteItem handleDelete={handleDelete} />
            </Modal>

        </div>

    );
};

export default PosPage;
