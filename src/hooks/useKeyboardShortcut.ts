import { useEffect } from "react";

export function useKeyboardShortcut(keys, callback) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const pressedKey = event.key.toLowerCase();
      const match = keys.every((key) => {
        if (key === "ctrl") return event.ctrlKey;
        if (key === "shift") return event.shiftKey;
        if (key === "alt") return event.altKey;
        return pressedKey === key.toLowerCase();
      });

      if (match) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keys, callback]);
}