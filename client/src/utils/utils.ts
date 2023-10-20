//return invested value, calculated from user holdings
//quantity and price derived from holdings array in DB

import type { Holding } from "../types";

//price = purchase price
/**
 * @param holdings - An array of objects of type Holding
 * @returns The total invested value as a number
 */
export function getInvestedValue(holdings: Holding[]): number {
  return holdings.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.quantity) * currentValue.price;
  }, 0);
}

/**
 * Create object containing {ticker: price} combinations
 *
 * @returns A promise that returns a new Map<string, number> representing the price of each ticker
 *
 */
export async function getPrices(
  holdings: Holding[],
): Promise<Map<string, number>> {
  const prices = new Map<string, number>();
  const uniqueTickers = new Set(holdings.map((holding) => holding.symbol));
  try {
    const priceRequests = [...uniqueTickers].map(async (ticker) => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/stock/quote/${ticker}`,
      );
      const parsed = await response.json();
      if (!parsed.data.c) {
        throw new Error(`Error fetching ${ticker} quote`);
      }
      prices.set(ticker, parsed.data.c);
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
export async function getTotalValue(
  holdings: Holding[],
  prices: Map<string, number>,
) {
  return holdings.reduce((accumulator: number, currentValue: Holding) => {
    const price = prices.get(currentValue.symbol);
    if (!price || price < 0) {
      throw new Error("Missing prices");
    }
    return accumulator + currentValue.quantity * price;
  }, 0);
}

export function getUniques(holdings: Holding[]) {
  const uniqueValues = new Map<string, number>();
  for (let i = 0; i < holdings.length; i++) {
    const holding = holdings[i];
    const value = uniqueValues.get(holding.symbol);
    if (value) {
      uniqueValues.set(holding.symbol, value + holding.quantity);
    } else {
      uniqueValues.set(holding.symbol, holding.quantity);
    }
  }
  uniqueValues.forEach((value, key) => {
    if (value <= 0) {
      uniqueValues.delete(key);
    }
  });
  return uniqueValues;
}

// eslint-disable-next-line
export function debounce(fn: (...args: any[]) => void, t: number) {
  let timer: NodeJS.Timeout;
  // eslint-disable-next-line
  return function (...args: any[]) {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      return fn(...args);
    }, t);
  };
}

export async function getHoldings(accessToken: string) {
  try {
    const { VITE_SERVER_URL } = import.meta.env;
    const response = await fetch(`${VITE_SERVER_URL}/transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    }
  }
}
