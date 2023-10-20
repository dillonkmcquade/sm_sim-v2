import { Reducer, useReducer } from "react";
import { Result } from "../types";

const initialState = {
  results: [] as Result[],
  error: "",
  loading: false,
  inputText: "",
  isSelected: 0,
};

type Action =
  | { type: "search" }
  | { type: "clear" }
  | {
      type: "field";
      field: "inputText" | "isSelected";
      payload: string | number;
    }
  | { type: "success"; payload: Result[] }
  | { type: "error"; payload: string };

const reducer: Reducer<typeof initialState, Action> = (state, action) => {
  switch (action.type) {
    case "field":
      return { ...state, [action.field]: action.payload };
    case "search":
      return { ...state, loading: true, error: "" };
    case "success":
      return { ...state, results: action.payload, loading: false };
    case "error":
      return { ...state, results: [], loading: false, error: action.payload };
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

  const updateField = (
    field: "inputText" | "isSelected",
    value: string | number,
  ) => {
    dispatch({ type: "field", field: field, payload: value });
  };

  return { startSearch, success, errorMessage, clear, updateField, state };
}
