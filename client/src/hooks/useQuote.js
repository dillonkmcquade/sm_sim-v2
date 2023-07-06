import { useEffect, useState } from "react";
export default function useQuote(ticker) {
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    (async () => {
      const { REACT_APP_FINNHUB_KEY } = process.env;
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${REACT_APP_FINNHUB_KEY}`
        );
        const parsed = await response.json();
        setQuote(parsed);
      } catch (error) {
        console.error(error.message);
      }
    })();
  }, []);
  return { quote };
}
