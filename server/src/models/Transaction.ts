export class Transaction {
  readonly symbol: string;
  readonly quantity: number;
  readonly price: number;
  readonly transaction_id: string;

  constructor(
    symbol: string,
    quantity: number,
    price: number,
    transaction_id: string,
  ) {
    this.symbol = symbol;
    this.quantity = quantity;
    this.price = price;
    this.transaction_id = transaction_id;
  }
}
