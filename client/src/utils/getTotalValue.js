//return invested value, calculated from user holdings
//quantity and price derived from holdings array in DB
//price = purchase price
export const getInvestedValue = (holdings) => {
  const investedValue = holdings.reduce((accumulator, currentValue) => {
    return accumulator + Number(currentValue.quantity) * currentValue.price;
  }, 0);
  return investedValue;
};

//create object containing {ticker: price} combinations
const getPrices = async (holdings) => {
  const uniques = {};
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
      if (cached) {
        uniques[key] = JSON.parse(cached).c;
      } else {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${key}&token=${REACT_APP_FINNHUB_KEY}`
        );
        const parsed = await response.json();
        uniques[key] = parsed.c;
      }
    }
  } catch (err) {
    console.error(err.message);
  }
  return uniques;
};

//returns total value of holdings
export async function getTotalValue(holdings) {
  const prices = await getPrices(holdings);

  return holdings.reduce((accumulator, currentValue) => {
    return (
      accumulator + Number(currentValue.quantity) * prices[currentValue.ticker]
    );
  }, 0);
}
