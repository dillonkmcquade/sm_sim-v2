import { useEffect, useState } from "react";

export default function useTickerNewsData(ticker) {
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  const [news, setNews] = useState(() => {
    const cachedData = window.localStorage.getItem(`${ticker}news`);
    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      return null;
    }
  });

  useEffect(
    (ticker) => {
      async function getTickerData() {
        setIsLoadingNews(true);
        try {
          const { REACT_APP_POLYGON_KEY } = process.env;
          const request = await fetch(
            `https://api.polygon.io/v2/reference/news?ticker=${ticker}&apiKey=${REACT_APP_POLYGON_KEY}`
          );
          const response = await request.json();
          if (response.results) {
            setNews(response.results);
            window.localStorage.setItem(
              `${ticker}news`,
              JSON.stringify(response.results)
            );
          }
        } catch (err) {
          console.error(err);
          setIsLoadingNews(false);
        } finally {
          setIsLoadingNews(false);
        }
      }
      if (!news) {
        getTickerData();
      }
    },
    [news]
  );
  return { news, isLoadingNews };
}
