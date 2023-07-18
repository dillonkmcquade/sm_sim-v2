import { useReducer } from "react";

interface Result {
  symbol: string;
  description: string;
}
const initialState = {
  results: null,
  error: "",
  loading: false,
  inputText: "",
  isSelected: 0,
};
const reducer = (
  state: typeof initialState,
  action: { type: string; field?: any; payload?: any },
) => {
  switch (action.type) {
    case "field":
      return { ...state, [action.field]: action.payload };
    case "search":
      return { ...state, loading: true, error: "" };
    case "success":
      return { ...state, results: action.payload, loading: false };
    case "error":
      return { ...state, results: null, loading: false, error: action.payload };
    case "clear":
      return initialState;
    default:
      throw new Error("Error");
  }
};
export default function useSearchReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startSearch = () => {
    dispatch({ type: "search" });
  };

  const success = (results: Result[]) => {
    dispatch({ type: "success", payload: results });
  };

  const errorMessage = (message: string) => {
    dispatch({ type: "error", payload: message });
  };

  const clear = () => {
    dispatch({ type: "clear" });
  };

  const updateField = (field: string, value: string | number) => {
    dispatch({ type: "field", field: field, payload: value });
  };

  return { startSearch, success, errorMessage, clear, updateField, state };
}
