import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../user/models/User.entity";

@Entity("transactions")
export abstract class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public symbol?: string;

  @Column()
  public quantity?: number;

  @Column()
  public price?: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user?: User;

  @CreateDateColumn()
  public created_at?: Date;

  public getTotalPrice(): number {
    return this.quantity! * this.price!;
  }
  abstract verify(arg0: number): boolean;
}

export class Purchase extends Transaction {
  /**
   * Verifies if the user has enough money to make the purchase
   * @param balance - The user's current balance
   */
  public verify(balance: number): boolean {
    if (balance > Number(this.price)) {
      return true;
    }
    return false;
  }
}

export class Sale extends Transaction {
  /**
   * Verifies if the user has enough shares to make the sale
   *@param numShares - The number of shares of this stock owned by the user
   */
  public verify(numShares: number): boolean {
    if (numShares > -this.quantity!) {
      return true;
    }

    return false;
  }
}

export type TransactionType = "buy" | "sell";

export class TransactionBuilder {
  private transaction: Transaction;

  constructor(type: TransactionType) {
    if (type === "buy") {
      this.transaction = new Purchase();
    } else if (type === "sell") {
      this.transaction = new Sale();
    } else {
      throw new Error(
        "Invalid transaction type: TransactionBuilder only recognizes 'buy' or 'sell'",
      );
    }
  }
  public addSymbol(symbol: string): TransactionBuilder {
    this.transaction.symbol = symbol;
    return this;
  }
  public addQuantity(quantity: number): TransactionBuilder {
    this.transaction.quantity = quantity;
    return this;
  }
  public addPrice(price: number): TransactionBuilder {
    this.transaction.price = price;
    return this;
  }
  public addUserId(user: User): TransactionBuilder {
    this.transaction.user = user;
    return this;
  }
  /**
   * @throws Error if transaction incomplete or an invalid transaction type is given
   * @returns A complete transaction
   */
  public getTransaction(): Transaction {
    if (
      this.transaction.symbol === undefined ||
      this.transaction.quantity === undefined ||
      this.transaction.price === undefined
    ) {
      throw new Error("Transaction is missing fields");
    }
    return this.transaction;
  }
}
