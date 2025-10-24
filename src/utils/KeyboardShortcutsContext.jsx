import { createContext, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const KeyboardShortcutsContext = createContext(null);

export function KeyboardShortcutsProvider({ children }) {
  const navigate = useNavigate();

  const globalShortcuts = {
    f10: () => navigate("/pos"),
    f11: () => navigate("/customers"),
    f12: () => navigate("/"),
    arrowdown: () => focusNextInput(),
    arrowup: () => focusPreviousInput()
  };

  const location = useLocation();       // ✔ OK — agora está 100% dentro do Router

  // const localShortcuts = pageShortcuts[location.pathname] || {};

  const allShortcuts = {
    ...globalShortcuts,
    // ...localShortcuts,
  };

  useEffect(() => {
    const handler = (event) => {
      const key = event.key.toLowerCase();
      const action = allShortcuts[key];
      if (action) {
        event.preventDefault();
        action();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [allShortcuts]);

  return (
    <KeyboardShortcutsContext.Provider value={{}}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  return useContext(KeyboardShortcutsContext);
}

// // Define atalhos por página
// export const pageShortcuts = {
//   "/pos": {
//     f1: () => console.log("Atalho F2 local no POS"),
//   },
//   "/payment": {
//     f7: () => console.log("Atalho F3 só nessa página"),
//   },
// };

function focusNextInput() {
  const focusableElements = getFocusableElements();
  const index = focusableElements.indexOf(document.activeElement);

  if (index >= 0 && index < focusableElements.length - 1) {
    focusableElements[index + 1].focus();
  }
}

function focusPreviousInput() {
  const focusableElements = getFocusableElements();
  const index = focusableElements.indexOf(document.activeElement);

  if (index > 0) {
    focusableElements[index - 1].focus();
  }
}

function getFocusableElements() {
  return Array.from(
    document.querySelectorAll(
      "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )
  );
}