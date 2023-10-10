import { Pool } from "pg";
import { DatabaseServiceModel } from "../../lib/DatabaseServiceModel";
import { Transaction } from "./models/Transaction";

export class TransactionService extends DatabaseServiceModel<Transaction> {
  constructor(db: Pool) {
    super(db);
  }
  public async create(transaction: Transaction): Promise<void> {
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
  public async findById(userId: string): Promise<Transaction[]> {
    const { rows } = await this.query(
      "SELECT * FROM transactions WHERE user_id=$1",
      [userId],
    );
    return rows;
  }

  public async getNumSharesBySymbol(
    userId: string,
    symbol: string,
  ): Promise<number> {
    const { rows } = await this.query<{ numShares: number }>(
      `
    SELECT 
      sum(quantity) as numShares
    FROM
      transactions
    WHERE
      user_id=$1
    AND
      symbol=$2
`,
      [userId, symbol],
    );
    return rows[0].numShares;
  }
}
