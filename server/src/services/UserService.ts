import type { Pool } from "pg";
import type { Request } from "express";
import type { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import format from "pg-format";
import { JWTPayload } from "express-oauth2-jwt-bearer";

export class UserService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async createUser(payload: JWTPayload): Promise<User> {
    const data = await this.pool.query<User>(
      `INSERT INTO users 
          (name, email, nickname, picture, balance, watch_list, auth0_id)
       VALUES 
          ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        payload.name,
        payload.email,
        payload.nickname,
        payload.picture,
        1000000,
        [],
        payload.sub,
      ],
    );

    return new User(data.rows[0]);
  }

  public async updateUser(req: Request, authKey: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const keys = Object.keys(req.body);
      const queries = keys.map(async (key) => {
        const sql = format("UPDATE users SET %I = $1 WHERE auth0_id=$2", key);
        await client.query(sql, [req.body[key], authKey]);
      });
      await Promise.all(queries);
      await client.query(
        `UPDATE users SET updated_on = CURRENT_TIMESTAMP WHERE auth0_id=$1`,
        [authKey],
      );
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }

  public async deleteUser(authKey: string): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM transactions WHERE user_id=$1", [
        authKey,
      ]);
      await client.query("DELETE FROM users WHERE auth0_id=$1", [authKey]);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }

  public async getUser(authKey: string): Promise<User | undefined> {
    const data = await this.pool.query<User>(
      "SELECT * FROM users WHERE auth0_id=$1",
      [authKey],
    );
    if (data.rowCount) {
      return new User(data.rows[0]);
    } else {
      return undefined;
    }
  }

  private async getWatchList(auth: string): Promise<string[]> {
    const query = await this.pool.query<User>(
      "SELECT watch_list from users where auth0_id=$1",
      [auth],
    );
    return query.rows[0].watch_list;
  }

  private async addToWatchList(
    auth: string,
    ticker: string,
  ): Promise<string[]> {
    const query = await this.pool.query<User>(
      `UPDATE 
          users 
       SET 
          watch_list = array_append(watch_list, $1),
          updated_on = CURRENT_TIMESTAMP
       WHERE 
          auth0_id=$2 
       RETURNING 
          watch_list`,
      [ticker, auth],
    );
    return query.rows[0].watch_list;
  }

  private async removeFromWatchList(
    auth: string,
    watchList: string[],
  ): Promise<string[]> {
    // overwrite old watch list with new watch list
    const query = await this.pool.query<User>(
      `UPDATE users
      SET 
        watch_list = $1,
        updated_on = CURRENT_TIMESTAMP
      WHERE 
        auth0_id=$2
      RETURNING
        watch_list`,
      [watchList, auth],
    );

    return query.rows[0].watch_list;
  }

  public async toggleWatchList(
    auth: string,
    isWatched: boolean,
    ticker: string,
  ): Promise<string[] | undefined> {
    let result;
    const watchList = await this.getWatchList(auth);
    if (isWatched && !watchList.includes(ticker)) {
      //Add
      result = await this.addToWatchList(auth, ticker);
    } else if (!isWatched && watchList?.includes(ticker)) {
      //Remove
      watchList.splice(watchList.indexOf(ticker));
      result = this.removeFromWatchList(auth, watchList);
    } else {
      //Do nothing
      return;
    }
    return result;
  }

  public async getHoldings(authKey: string): Promise<Transaction[]> {
    const { rows } = await this.pool.query<Transaction>(
      "SELECT * FROM transactions WHERE user_id=$1",
      [authKey],
    );
    return rows;
  }
  public async getNumSharesBySymbol(authKey: string): Promise<number> {
    const rows = await this.pool.query(
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

  public async insertTransaction(transaction: Transaction): Promise<void> {
    await this.pool.query(
      "INSERT INTO transactions (user_id, symbol, quantity, price) VALUES ($1, $2, $3, $4)",
      [
        transaction.user_id,
        transaction.symbol,
        transaction.quantity,
        transaction.price,
      ],
    );
  }

  public async getBalance(auth: string): Promise<number> {
    const balance = await this.pool.query<User>(
      "SELECT balance FROM users WHERE auth0_id=$1",
      [auth],
    );
    return balance.rows[0].balance;
  }

  public async setBalance(
    authKey: string,
    newBalance: number,
  ): Promise<number> {
    // update balance retrieve new balance
    const rows = await this.pool.query<User>(
      "UPDATE users SET balance = balance - $1 WHERE auth0_id=$2 RETURNING balance",
      [newBalance, authKey],
    );
    return rows.rows[0].balance;
  }
}
