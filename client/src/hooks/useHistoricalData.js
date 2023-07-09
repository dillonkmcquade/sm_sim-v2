import { useEffect, useState, useReducer } from "react";

const currentTime = Date.now() / 1000;
const initialState = {
  resolution: "D",
  range: "1M",
  from: Math.floor(currentTime - 2629800),
  loading: false,
};

const reducer = (state, action) => {
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

export default function useHistoricalData(ticker) {
  const [data, setData] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { resolution, from, loading } = state;
  const currentDay = new Date().getDay();

  useEffect(() => {
    const fetchCandleData = async () => {
      const { REACT_APP_FINNHUB_KEY } = process.env;
      dispatch({ type: "loading" });
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${Math.floor(
            Date.now() / 1000
          )}&token=${REACT_APP_FINNHUB_KEY}`
        );
        const parsed = await response.json();
        setData(parsed);

        dispatch({ type: "finished" });
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCandleData();
  }, [resolution, from, ticker]);

  return { currentDay, state, data, loading, dispatch };
}
