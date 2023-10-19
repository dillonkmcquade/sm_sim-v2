//Fetch latest quote of specified ticker symbol, cached in sessionstorage

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Quote } from "../types";
export default function useQuote(ticker: string) {
  const navigate = useNavigate();
  const [quote, setQuote] = useState<Quote | null>(() => {
    const cached = window.sessionStorage.getItem(ticker);
    const parsed = cached === null ? null : JSON.parse(cached);

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
      setLoadingQuote(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/stock/quote/${ticker}`,
        );
        const parsed = await response.json();
        if (parsed.c) {
          setQuote(parsed);
          window.sessionStorage.setItem(
            ticker,
            JSON.stringify({
              ...parsed,
              t: Math.floor(Date.now() / 1000),
            }),
          );
          setLoadingQuote(false);
        } else {
          throw new Error(`Error fetching ${ticker} quote`);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
          navigate(-1);
        }
        setLoadingQuote(false);
      }
    }
    if (!quote) {
      getQuote();
    }
  }, [navigate, quote, ticker]);
  return { quote, loadingQuote };
}
