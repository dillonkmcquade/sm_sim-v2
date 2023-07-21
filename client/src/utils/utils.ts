//return invested value, calculated from user holdings
//quantity and price derived from holdings array in DB

import type { Holding } from "../types";

//price = purchase price
export function getInvestedValue(holdings: Holding[]) {
  return holdings.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.quantity) * currentValue.price;
  }, 0);
}

//create object containing {ticker: price} combinations
async function getPrices(holdings: Holding[]): Promise<{ ticker: number }[]> {
  const prices: any = {};
  const uniqueTickers = Array.from(
    new Set(holdings.map((holding) => holding.ticker)),
  );
  const { REACT_APP_FINNHUB_KEY } = process.env;
  try {
    const priceRequests = uniqueTickers.map(async (ticker) => {
      const cached = window.sessionStorage.getItem(ticker);
      if (cached && Date.now() / 1000 - JSON.parse(cached).t < 300) {
        // Check for stale data
        prices[ticker] = JSON.parse(cached).c;
      } else {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${REACT_APP_FINNHUB_KEY}`,
        );
        const parsed = await response.json();
        if (!parsed.c) {
          throw new Error(`Error fetching ${ticker} quote`);
        }
        prices[ticker] = parsed.c;
      }
    });

    await Promise.all(priceRequests);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
  return prices;
}

//returns total value of holdings
export async function getTotalValue(holdings: Holding[]) {
  const prices: any = await getPrices(holdings);

  return holdings.reduce((accumulator: number, currentValue: Holding) => {
    return accumulator + currentValue.quantity * prices[currentValue.ticker];
  }, 0);
}

export function getUniques(holdings: Holding[]) {
  const uniqueValues: any = {};
  for (let i = 0; i < holdings.length; i++) {
    const holding = holdings[i];
    if (uniqueValues[holding.ticker]) {
      uniqueValues[holding.ticker] += holding.quantity;
    } else {
      uniqueValues[holding.ticker] = holding.quantity;
    }
  }

  const uniqueTickers = Object.keys(uniqueValues);
  const newArr: { ticker: string; quantity: number }[] = new Array(
    uniqueTickers.length,
  );

  for (let i = 0; i < uniqueTickers.length; i++) {
    const ticker = uniqueTickers[i];
    const quantity = uniqueValues[ticker];
    if (quantity === 0) continue;
    newArr[i] = { ticker, quantity };
  }

  return newArr.filter(Boolean);
}

export function debounce(fn: Function, t: number) {
  let timer: NodeJS.Timeout;
  return function (...args: any[]) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      return fn(...args);
    }, t);
  };
}
