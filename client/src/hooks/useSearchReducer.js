import { useReducer } from "react";

const initialState = {
  results: null,
  error: "",
  loading: false,
  inputText: "",
  isSelected: 0,
};
const reducer = (state, action) => {
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

  const success = (results) => {
    dispatch({ type: "success", payload: results });
  };

  const errorMessage = (message) => {
    dispatch({ type: "error", payload: message });
  };

  const clear = () => {
    dispatch({ type: "clear" });
  };

  const updateField = (field, value) => {
    dispatch({ type: "field", field: field, payload: value });
  };

  return { startSearch, success, errorMessage, clear, updateField, state };
}
