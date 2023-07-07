import { useEffect, useState } from "react";
export default function useQuote(ticker) {
  const [quote, setQuote] = useState(() => {
    const cached = window.sessionStorage.getItem(ticker);
    const parsed = JSON.parse(cached);

    //return null if data is 5 minutes old, triggering refetch
    if (cached && Date.now() / 1000 - parsed.t < 300) {
      return parsed;
    } else {
      return null;
    }
  });

  const [loadingQuote, setLoadingQuote] = useState(false);
  useEffect(() => {
    async function getQuote() {
      const { REACT_APP_FINNHUB_KEY } = process.env;
      setLoadingQuote(true);
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${REACT_APP_FINNHUB_KEY}`
        );
        const parsed = await response.json();
        if (parsed.c) {
          setQuote(parsed);
          window.sessionStorage.setItem(
            ticker,
            JSON.stringify({ ...parsed, t: Math.floor(Date.now() / 1000) })
          );
          setLoadingQuote(false);
        }
      } catch (error) {
        console.error(error.message);
        setLoadingQuote(false);
      }
    }
    if (!quote) {
      getQuote();
    }
  }, [ticker]);
  return { quote, loadingQuote };
}
