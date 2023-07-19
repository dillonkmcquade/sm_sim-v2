//return invested value, calculated from user holdings
//quantity and price derived from holdings array in DB

import { Holding } from "../context/UserContext";

//price = purchase price
export function getInvestedValue(holdings: Holding[]) {
  return holdings.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.quantity) * currentValue.price;
  }, 0);
}

//create object containing {ticker: price} combinations
async function getPrices(holdings: Holding[]) {
  const uniques: any = {};
  holdings.forEach((holding) => {
    if (!uniques[holding.ticker]) {
      uniques[holding.ticker] = 0;
    }
  });
  const keys = Object.keys(uniques);
  const { REACT_APP_FINNHUB_KEY } = process.env;
  try {
    for await (const key of keys) {
      const cached = window.sessionStorage.getItem(key);
      if (cached && Date.now() / 1000 - JSON.parse(cached).t < 300) {
        //Check for stale data
        uniques[key] = JSON.parse(cached).c;
      } else {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${key}&token=${REACT_APP_FINNHUB_KEY}`,
        );
        const parsed = await response.json();
        uniques[key] = parsed.c;
      }
    }
  } catch (err: any) {
    console.error(err.message);
  }
  return uniques;
}

//returns total value of holdings
export async function getTotalValue(holdings: Holding[]) {
  const prices: any = await getPrices(holdings);

  return holdings.reduce((accumulator: number, currentValue: Holding) => {
    return (
      accumulator +
      Number(currentValue.quantity) * Number(prices[currentValue.ticker])
    );
  }, 0);
}

//Filter user holdings down to {ticker, quantity} array
//
export function getUniques(holdings: Holding[]) {
  const uniqueValues: any = {};
  holdings.forEach((holding) => {
    if (uniqueValues[holding.ticker]) {
      uniqueValues[holding.ticker] += holding.quantity;
    } else {
      uniqueValues[holding.ticker] = holding.quantity;
    }
  });
  const newArr: { ticker: string; quantity: number }[] = [];
  Object.keys(uniqueValues).forEach((ticker: string) => {
    if (uniqueValues[ticker] === 0) return;
    newArr.push({ ticker: ticker, quantity: uniqueValues[ticker] });
  });
  return newArr;
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
