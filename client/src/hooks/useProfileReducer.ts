import { Reducer, useReducer } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { Update, User } from "../types";

const initialState = {
  formData: {} as Update,
  loading: false,
  error: "",
  confirmed: false,
};

export enum ReducerType {
  formData = "formData",
  loading = "loading",
  success = "success",
  error = "error",
}

type Action =
  | { type: ReducerType.formData; payload: Update }
  | { type: ReducerType.error; payload: string }
  | { type: ReducerType.success; payload: User }
  | { type: ReducerType.loading };

const reducer: Reducer<typeof initialState, Action> = (state, action) => {
  switch (action.type) {
    case ReducerType.formData:
      return {
        ...state,
        formData: action.payload,
        confirmed: false,
        loading: false,
      };
    case ReducerType.loading:
      return { ...state, loading: true, error: "" };
    case ReducerType.success:
      return { ...state, loading: false, confirmed: true, formData: {} };
    case ReducerType.error:
      return {
        ...state,
        loading: false,
        error: action.payload,
        formData: {},
        confirmed: false,
      };
    default:
      throw new Error("Invalid dispatch type");
  }
};
export default function usePurchaseReducer() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { setCurrentUser } = useCurrentUser();

  const setLoading = () => {
    dispatch({ type: ReducerType.loading });
  };

  const success = (value: User) => {
    setCurrentUser(value);
    dispatch({ type: ReducerType.success, payload: value });
  };

  const errorMessage = (message: string) => {
    dispatch({ type: ReducerType.error, payload: message });
  };

  return {
    setLoading,
    success,
    errorMessage,
    state,
    dispatch,
  };
}
