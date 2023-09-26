/*
 * The transaction interface allows us to extend the application to include other types of transactions
 */
export interface Transaction {
  symbol: string;
  quantity: number;
  price: number;
  user_id: string;

  getTotalPrice(): number;
}
export class Purchase implements Transaction {
  public symbol: string;
  public quantity: number;
  public price: number;
  public user_id: string;

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
  public getTotalPrice(): number {
    return this.quantity * this.price;
  }
}

export class Sale implements Transaction {
  public symbol: string;
  public quantity: number;
  public price: number;
  public user_id: string;

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
  public getTotalPrice(): number {
    return this.quantity * this.price;
  }
}
