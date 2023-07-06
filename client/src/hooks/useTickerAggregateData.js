import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useAggregateData(ticker) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const [currentPrice, _setCurrentPrice] = useState(() => {
    const cachedData = window.localStorage.getItem(ticker);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return parsedData[parsedData.length - 1].Close.toFixed(2);
    } else {
      return null;
    }
  });

  const [previousDayPrice, _setPreviousDayPrice] = useState(() => {
    const cachedData = window.localStorage.getItem(ticker);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return parsedData[parsedData.length - 2].Close.toFixed(2);
    } else {
      return null;
    }
  });

  const [currentTicker, setCurrentTicker] = useState(() => {
    const cachedData = window.localStorage.getItem(ticker);
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      return null;
    }
  });

  useEffect(() => {
    async function getTickerData() {
      setIsLoading(true);
      try {
        const { REACT_APP_POLYGON_KEY } = process.env;
        const request = await fetch(
          `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/week/${
            Date.now() - 7889400000
          }/${Date.now()}?adjusted=true&sort=asc&limit=180&apiKey=${REACT_APP_POLYGON_KEY}`
        );
        const response = await request.json();

        if (response.results) {
          const dataArray = response.results;
          const modifiedData = dataArray.map((index) => ({
            Open: index.o,
            Close: index.c,
            Time: index.t,
          }));

          setCurrentTicker(modifiedData);
          _setCurrentPrice(
            modifiedData[modifiedData.length - 1].Close.toFixed(2)
          );
          _setPreviousDayPrice(
            modifiedData[modifiedData.length - 2].Close.toFixed(2)
          );
          window.localStorage.setItem(ticker, JSON.stringify(modifiedData));
        } else {
          setError();
          const navigate = useNavigate();
          navigate("/research");
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (!currentTicker) {
      getTickerData();
    }
  }, [currentTicker, ticker]);

  return {
    currentPrice,
    previousDayPrice,
    currentTicker,
    setCurrentTicker,
    isLoading,
    error,
  };
}
