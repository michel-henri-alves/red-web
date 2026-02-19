import { useCallback, useMemo, useReducer } from "react";

const CART_ACTIONS = {
  ADD: "ADD",
  REMOVE_AT: "REMOVE_AT",
  CLEAR: "CLEAR",
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      console.log("Adding to cart:", action.payload);
      const item = action.payload;
      console.log("item", item);
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

// const useCart = (initial = { scans: [], bill: 0 }) => {
export function useCart (initial = { scans: [], bill: 0 }) {
  const [state, dispatch] = useReducer(cartReducer, initial);

  const add = useCallback((item) => dispatch({ type: CART_ACTIONS.ADD, payload: item }), []);
  const removeAt = useCallback((index) => dispatch({ type: CART_ACTIONS.REMOVE_AT, payload: index }), []);
  const clear = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR }), []);

  const total = useMemo(() => state.bill, [state.bill]);
  const items = useMemo(() => state.scans, [state.scans]);

  return { items, total, add, removeAt, clear };
};