import { getUniques, getInvestedValue } from "../utils/utils";

const holdings = [
  { symbol: "BRK.A", quantity: 1, price: 523500 },
  { symbol: "TSLA", quantity: 1000, price: 290.38 },
  { symbol: "TSLA", quantity: 1, price: 288.39 },
  { symbol: "AAPL", quantity: 1, price: 193.47 },
  { symbol: "BRK.A", quantity: -1, price: 523500 },
];
const holdings1 = [
  { symbol: "BRK.A", quantity: 1, price: 523500 },
  { symbol: "TSLA", quantity: 1000, price: 290.38 },
  { symbol: "TSLA", quantity: 1, price: 288.39 },
  { symbol: "AAPL", quantity: 1, price: 193.47 },
  { symbol: "BRK.A", quantity: -1, price: 523500 },
  { symbol: "BRK.A", quantity: -1, price: 523500 },
];

describe("testing getUniques", () => {
  test("testing for quantities === 0", () => {
    expect(getUniques(holdings)).toEqual([
      { ticker: "TSLA", quantity: 1001 },
      { ticker: "AAPL", quantity: 1 },
    ]);
  });
  test("testing for negative quantities", () => {
    expect(getUniques(holdings1)).toEqual([
      { ticker: "TSLA", quantity: 1001 },
      { ticker: "AAPL", quantity: 1 },
    ]);
  });
});
describe("testing getInvestedValue", () => {
  test("return invested value", () => {
    expect(getInvestedValue(holdings)).toEqual(290861.86);
  });
});
