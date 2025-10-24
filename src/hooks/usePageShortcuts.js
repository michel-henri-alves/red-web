import { useEffect } from "react";
import { useKeyboardShortcutsContext } from "./KeyboardShortcutsContext";

export function usePageShortcuts(shortcuts) {
  const { registerPageShortcuts, clearPageShortcuts } =
    useKeyboardShortcutsContext();

  useEffect(() => {
    registerPageShortcuts(shortcuts);
    return () => clearPageShortcuts();
  }, [shortcuts]);
}
