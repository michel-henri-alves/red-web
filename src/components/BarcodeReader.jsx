import React, { useEffect, useRef, useState } from 'react';
import { findProductBySmartCode } from "red-shared";
import { useTranslation } from 'react-i18next'
import DraggableDiv from './DraggableDiv';


const BarcodeReader = ({ onScan, postToBackend = true }) => {

    const { t } = useTranslation();

    const {
        mutate: getProduct,
        isLoading: isLoading,
        isSuccess: isSuccess,
        isError: isError,
        error: error,
        reset: reset,
    } = findProductBySmartCode();
    const inputRef = useRef(null);
    const [lastScan, setLastScan] = useState(null);
    const [scans, setScans] = useState([]);
    const [bill, setBill] = useState(0);
    const [isBeepEnabled, setBeepEnabled] = useState(true);

    const [lastTimestamp, setLastTimestamp] = useState(0);

    const handleDelete = (index) => {

        var productForDelete = scans[index];

        setScans((prev) => prev.filter((_, i) => i !== index));
        setBill((prevBill) => prevBill - parseFloat(productForDelete.price));
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
                if (data !== undefined) {
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

    useEffect(() => {
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
                // setScans((prev) => [code, ...prev.slice(0, 9)]);
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
            onClick={() => inputRef.current?.focus()}
        >
            <DraggableDiv children={
                <div className="bg-white shadow rounded px-4 py-2 text-green-600 font-bold text-xl font-mono border border-gray-200 z-50">
                    <div>
                        {t("sales.bill.total")}&nbsp;💲{bill.toFixed(2)}
                    </div>
                </div>
            } />

            <div className="w-full bg-white dark:bg-gray-900 shadow-md p-4 flex justify-between items-center rounded-2xl">

                <div className="flex gap-3">
                    <button className="p-2 px-4 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition text-sm flex items-center gap-1 cursor-pointer">
                        💰 <span>Finalizar compra</span>
                    </button>
                    <button className="p-2 px-4 rounded-xl bg-yellow-400 text-white hover:bg-yellow-500 transition text-sm flex items-center gap-1 cursor-pointer">
                        ✍️ <span>Inserir manualmente</span>
                    </button>
                    <button className="p-2 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition text-sm flex items-center gap-1 cursor-pointer">
                        🧹 <span>Limpar</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Som</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isBeepEnabled}
                            onChange={() => setBeepEnabled(!isBeepEnabled)}
                            className="sr-only peer"
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
                onBlur={() => setTimeout(() => inputRef.current?.focus(), 100)}
                style={{ opacity: 0, position: 'absolute', pointerEvents: 'none' }}
            />
            <br />
            <h2 className="text-xl font-bold mb-4">🛒 {t("sales.product.list")}</h2>

            <div className="mb-3">
                <span className="font-semibold">{t("sales.last.product.read")}:</span>{' '}
                <span className="text-green-600 font-mono">{lastScan || 'Aguardando...'}</span>
            </div>

            <div className="h-full w-full border rounded">
                <table className="min-w-full text-lg font-mono table-fixed">
                    <thead className="bg-gray-200 sticky top-0 z-10">
                        <tr>
                            <th className="py-2 px-2 w-12 text-left">#</th>
                            <th className="py-2 px-2 text-left">{t('product.name')}</th>
                            <th className="py-2 px-2 text-left">{t('product.priceForSale')}</th>
                            <th className="py-2 px-2 text-left">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scans.map((scan, i) => (
                            <tr key={i} className="border-b border-gray-300">
                                <td className="py-1 px-2">{i + 1}</td>
                                <td className="py-1 px-2 break-all">{scan.name}</td>
                                <td className="py-1 px-2 break-all">{scan.price}</td>
                                <td className="py-1 px-2">
                                    <button
                                        onClick={() => handleDelete(i)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition cursor-pointer"
                                        title={t("button.tooltip.reduce")}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>

    );
};

export default BarcodeReader;
