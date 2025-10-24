import { useEffect } from "react";

export function useKeyboardShortcuts(map) {
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