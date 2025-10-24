import { useEffect, useRef } from "react";
//const useBarcodeScanner = ({ enabled = true, onScan, timeout = 100 }) => {
export function useBarcodeScanner({ enabled = true, onScan, timeout = 100 }) {

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