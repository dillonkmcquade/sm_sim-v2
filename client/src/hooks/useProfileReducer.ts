import { useContext, useReducer } from "react";
import { GlobalContent, User, UserContext } from "../context/UserContext";

const initialState = {
  formData: {},
  loading: false,
  error: "",
  confirmed: false,
};
const reducer = (
  state: typeof initialState,
  action: { type: string; payload?: any; field?: any },
) => {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.field]: action.payload,
        confirmed: false,
        loading: false,
      };
    case "loading":
      return { ...state, loading: true, error: "" };
    case "success":
      return { ...state, loading: false, confirmed: true, formData: {} };
    case "error":
      return {
        ...state,
        loading: false,
        error: action.payload,
        formData: {},
        confirmed: false,
      };
    default:
      throw new Error("Error");
  }
};
export default function usePurchaseReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setCurrentUser } = useContext(UserContext) as GlobalContent;

  const setLoading = () => {
    dispatch({ type: "loading" });
  };

  const success = (value: User | null) => {
    setCurrentUser(value);
    dispatch({ type: "success", payload: value });
  };

  const errorMessage = (message: string) => {
    dispatch({ type: "error", payload: message });
  };

  return {
    setLoading,
    success,
    errorMessage,
    state,
    dispatch,
  };
}
