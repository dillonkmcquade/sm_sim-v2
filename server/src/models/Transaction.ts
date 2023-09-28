/*
 * The transaction interface allows us to extend the application to include other types of transactions
 */
export interface Transaction {
  symbol: string;
  quantity: number;
  price: number;
  user_id: string;

  getTotalPrice(): number;
  verify(arg0: number): boolean;
}
class Purchase implements Transaction {
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
  public verify(balance: number): boolean {
    if (balance > Number(this.price)) {
      return true;
    }
    return false;
  }
}

class Sale implements Transaction {
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
  public verify(numShares: number): boolean {
    if (numShares > -this.quantity) {
      return true;
    }
    return false;
  }
}

export class TransactionBuilder {
  private symbol?: string;
  private quantity?: number;
  private price?: number;
  private user_id?: string;
  public type: string;
  constructor(type: string) {
    this.type = type;
  }

  public addSymbol(symbol: string): TransactionBuilder {
    this.symbol = symbol;
    return this;
  }
  public addQuantity(quantity: number): TransactionBuilder {
    this.quantity = quantity;
    return this;
  }
  public addPrice(price: number): TransactionBuilder {
    this.price = price;
    return this;
  }
  public addUserId(userId: string): TransactionBuilder {
    this.user_id = userId;
    return this;
  }
  public getTransaction(): Transaction {
    if (
      this.symbol === undefined ||
      this.quantity === undefined ||
      this.price === undefined ||
      this.user_id === undefined
    ) {
      throw new Error("Transaction is missing fields");
    }
    switch (this.type) {
      case "buy":
        return new Purchase(
          this.symbol,
          this.quantity,
          this.price,
          this.user_id,
        );
      case "sale":
        return new Sale(this.symbol, -this.quantity, this.price, this.user_id);
      default:
        throw new Error("Transaction type does not exist");
    }
  }
}
