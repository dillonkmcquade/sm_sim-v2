import { Pool } from "pg";
import { DatabaseServiceModel } from "./DatabaseServiceModel";
import { Transaction } from "../models/Transaction";

export class TransactionService extends DatabaseServiceModel<Transaction> {
  constructor(db: Pool) {
    super(db);
  }
  public async insertTransaction(transaction: Transaction): Promise<void> {
    await this.query(
      "INSERT INTO transactions (user_id, symbol, quantity, price) VALUES ($1, $2, $3, $4)",
      [
        transaction.user_id,
        transaction.symbol,
        transaction.quantity,
        transaction.price,
      ],
    );
  }
  public async getTransactions(authKey: string): Promise<Transaction[]> {
    const { rows } = await this.query(
      "SELECT * FROM transactions WHERE user_id=$1",
      [authKey],
    );
    return rows;
  }

  public async getNumSharesBySymbol(authKey: string): Promise<number> {
    const rows = await this.query<{ numShares: number }>(
      `
    SELECT 
      sum(quantity) as numShares
    FROM
      transactions
    WHERE
      user_id=$1
`,
      [authKey],
    );
    return rows.rows[0].numShares;
  }
}
