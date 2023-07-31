//Fetch historical data given the specified date range, changes based on user selected range toggle
//Range options are defined in reducer below

import { useEffect, useState, useReducer } from "react";
import type { Candle } from "../types";

const currentTime = Date.now() / 1000;
const initialState = {
  resolution: "D",
  range: "1M",
  from: Math.floor(currentTime - 2629800),
  loading: false,
};

const reducer = (
  state: typeof initialState,
  action: { type: string; payload?: any },
) => {
  switch (action.type) {
    case "1D":
      return {
        ...state,
        resolution: "30",
        range: "1D",
        from: Math.floor(currentTime - 86400),
      };
    case "1W":
      return {
        ...state,
        resolution: "D",
        range: "1W",
        from: Math.floor(currentTime - 604800),
      };
    case "1M":
      return {
        ...state,
        resolution: "D",
        range: "1M",
        from: Math.floor(currentTime - 2629800),
      };
    case "3M": {
      return {
        ...state,
        resolution: "D",
        range: "3M",
        from: Math.floor(currentTime - 7776000),
      };
    }
    case "6M": {
      return {
        ...state,
        resolution: "W",
        range: "6M",
        from: Math.floor(currentTime - 15638400),
      };
    }
    case "loading": {
      return { ...state, loading: true };
    }
    case "finished": {
      return { ...state, loading: false };
    }
    default:
      throw new Error("Error");
  }
};

export default function useHistoricalData(ticker: string) {
  const [data, setData] = useState<Candle | null>(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { resolution, from, loading } = state;
  const currentDay = new Date().getDay();

  useEffect(() => {
    const fetchCandleData = async () => {
      dispatch({ type: "loading" });
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/stock/candle/${ticker}?resolution=${resolution}&from=${from}`,
        );
        const parsed = await response.json();
        setData(parsed.data);

        dispatch({ type: "finished" });
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      }
    };
    fetchCandleData();
  }, [resolution, from, ticker]);

  return { currentDay, state, data, loading, dispatch };
}
