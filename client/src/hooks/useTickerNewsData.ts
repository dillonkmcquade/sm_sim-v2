//Fetch news related to specified ticker symbol

import { useEffect, useState } from "react";

export default function useTickerNewsData(ticker: string) {
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const [news, setNews] = useState(() => {
    const cachedData = window.localStorage.getItem(`${ticker}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      return null;
    }
  });

  useEffect(() => {
    async function getTickerData() {
      setIsLoadingNews(true);
      try {
        const { REACT_APP_POLYGON_KEY } = process.env;
        const request = await fetch(
          `https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=${REACT_APP_POLYGON_KEY}`,
        );
        const response = await request.json();
        if (response.results) {
          setNews(response.results);
          window.localStorage.setItem(
            `${ticker}`,
            JSON.stringify(response.results),
          );
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
        }
        setIsLoadingNews(false);
      } finally {
        setIsLoadingNews(false);
      }
    }
    if (!news) {
      getTickerData();
    }
  }, [news, ticker]);
  return { news, isLoadingNews };
}
