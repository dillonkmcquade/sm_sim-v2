import { useReducer } from "react";

const initFunc = (id, currentPrice) => {
  const initialState = {
    ticker: id,
    price: currentPrice,
    quantity: 1,
    action: "buy",
    loading: false,
    error: "",
    confirmed: false,
  };
  return initialState;
};
const reducer = (state, action) => {
  switch (action.type) {
    case "quantity":
      return { ...state, quantity: action.payload };
    case "loading":
      return { ...state, loading: true, error: "" };
    case "success":
      return { ...state, loading: false, confirmed: true };
    case "error":
      return { ...state, loading: false, error: action.payload };
    case "action":
      return { ...state, action: action.payload };
    default:
      throw new Error("Error");
  }
};
export default function usePurchaseReducer(id, currentPrice) {
  const [state, dispatch] = useReducer(reducer, initFunc(id, currentPrice));

  const setLoading = () => {
    dispatch({ type: "loading" });
  };

  const success = () => {
    dispatch({ type: "success" });
  };

  const errorMessage = (message) => {
    dispatch({ type: "error", payload: message });
  };

  const clear = () => {
    dispatch({ type: "clear" });
  };

  const updateQuantity = (value) => {
    dispatch({ type: "quantity", payload: value });
  };

  const changeAction = (value) => {
    dispatch({ type: "action", payload: value });
  };

  return {
    setLoading,
    updateQuantity,
    success,
    changeAction,
    errorMessage,
    clear,
    state,
  };
}
