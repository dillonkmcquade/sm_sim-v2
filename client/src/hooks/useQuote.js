import { useEffect, useState } from "react";
export default function useQuote(ticker) {
  const [quote, setQuote] = useState(0);
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
  }, [quote, ticker]);
  return { quote, loadingQuote };
}
