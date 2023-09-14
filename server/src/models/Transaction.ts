export class Transaction {
  readonly symbol: string;
  readonly quantity: number;
  readonly price: number;
  readonly user_id: string;

  constructor(
    symbol: string,
    quantity: number,
    price: number,
    user_id: string,
  ) {
    this.symbol = symbol;
    this.quantity = quantity;
    this.price = price;
    this.user_id = user_id;
  }
}
