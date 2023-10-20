import { Reducer, useReducer } from "react";

export enum ActionType {
  quantity = "quantity",
  loading = "loading",
  success = "success",
  error = "error",
  action = "action",
}

type Action =
  | { type: ActionType.loading }
  | { type: ActionType.success }
  | { type: ActionType.error; payload: string }
  | { type: ActionType.quantity; payload: number }
  | { type: ActionType.action; payload: string };

export default function usePurchaseReducer(transactionType: string) {
  const initialState = {
    quantity: 1,
    action: transactionType,
    loading: false,
    error: "",
    confirmed: false,
  };
  const reducer: Reducer<typeof initialState, Action> = (state, action) => {
    switch (action.type) {
      case ActionType.quantity:
        return { ...state, quantity: action.payload, error: "" };
      case ActionType.loading:
        return { ...state, loading: true, error: "" };
      case ActionType.success:
        return { ...state, loading: false, confirmed: true };
      case ActionType.error:
        return { ...state, loading: false, error: action.payload };
      case ActionType.action:
        return { ...state, action: action.payload };
      default:
        throw new Error("Error");
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = () => {
    dispatch({ type: ActionType.loading });
  };

  const success = () => {
    dispatch({ type: ActionType.success });
  };

  const errorMessage = (message: string) => {
    dispatch({ type: ActionType.error, payload: message });
  };

  const updateQuantity = (value: number) => {
    dispatch({ type: ActionType.quantity, payload: value });
  };

  const changeAction = (value: string) => {
    dispatch({ type: ActionType.action, payload: value });
  };

  return {
    setLoading,
    updateQuantity,
    success,
    changeAction,
    errorMessage,
    state,
  };
}
