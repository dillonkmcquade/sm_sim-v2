import { getUniques, getInvestedValue } from "../utils/utils";

const holdings = [
  { ticker: "BRK.A", quantity: 1, price: 523500 },
  { ticker: "TSLA", quantity: 1000, price: 290.38 },
  { ticker: "TSLA", quantity: 1, price: 288.39 },
  { ticker: "AAPL", quantity: 1, price: 193.47 },
  { ticker: "BRK.A", quantity: -1, price: 523500 },
];
const holdings1 = [
  { ticker: "BRK.A", quantity: 1, price: 523500 },
  { ticker: "TSLA", quantity: 1000, price: 290.38 },
  { ticker: "TSLA", quantity: 1, price: 288.39 },
  { ticker: "AAPL", quantity: 1, price: 193.47 },
  { ticker: "BRK.A", quantity: -1, price: 523500 },
  { ticker: "BRK.A", quantity: -1, price: 523500 },
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
