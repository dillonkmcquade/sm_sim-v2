//Filter user holdings down to {ticker, quantity} array
//
export const getUniques = (data) => {
  const map = {};
  data.forEach((item) => {
    if (map[item.ticker]) {
      map[item.ticker] += item.quantity;
    } else {
      map[item.ticker] = item.quantity;
    }
  });
  const newArr = [];
  Object.keys(map).forEach((item) => {
    if (map[item] === 0) return;
    newArr.push({ ticker: item, quantity: map[item] });
  });
  return newArr;
};
