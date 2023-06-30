import { useEffect, useState } from "react";

export default function useTickerAggregateData(ticker) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const [currentTicker, setCurrentTicker] = useState(() => {
    const cachedData = window.localStorage.getItem(ticker);
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      return null;
    }
  });
  async function getTickerData() {
    setIsLoading(true);
    try {
      const { REACT_APP_POLYGON_KEY } = process.env;
      const request = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${
          Date.now() - 7889400000
        }/${Date.now()}?adjusted=true&sort=asc&limit=180&apiKey=${REACT_APP_POLYGON_KEY}`
      );
      const response = await request.json();
      if (response.results) {
        setCurrentTicker(response.results);
        window.localStorage.setItem(ticker, JSON.stringify(response.results));
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!currentTicker) {
      getTickerData();
    }
  }, []);
  return { getTickerData, currentTicker, setCurrentTicker, isLoading, error };
}
