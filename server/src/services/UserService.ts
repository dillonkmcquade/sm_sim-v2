import type { Pool } from "pg";
import type { Request } from "express";
import type { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import format from "pg-format";

export type TUser = {
  id?: string;
  balance: number;
  telephone?: string;
  created_at?: Date;
  total?: number;
  address?: string;
  picture: string;
  name: string;
  nickname: string;
  email: string;
  auth0_id: string;
  [key: string]: any;
};

type Holding = {
  user_id: string;
  quantity: number;
  symbol: string;
  price: number;
};

export class UserService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async createUser(user: TUser): Promise<User> {
    const data = await this.pool.query<TUser>(
      `INSERT INTO users 
          (name, email, nickname, picture, balance, watch_list, created_at, auth0_id)
       VALUES 
          ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        user.name,
        user.email,
        user.nickname,
        user.picture,
        1000000,
        [],
        new Date(),
        user.getId(),
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
      await client.query("COMMIT");
    } catch (err) {
      console.log(err);
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
      console.log(err);
    } finally {
      client.release();
    }
  }

  public async getUser(authKey: string): Promise<User | undefined> {
    const data = await this.pool.query<TUser>(
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
    const query = await this.pool.query(
      "SELECT watch_list from users where auth0_id=$1",
      [auth],
    );
    return query.rows[0].watch_list;
  }

  private async addToWatchList(
    auth: string,
    ticker: string,
  ): Promise<string[]> {
    const query = await this.pool.query(
      `UPDATE 
          users 
       SET 
          watch_list = array_append(watch_list, $1) 
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
    const query = await this.pool.query<{ watch_list: string[] }>(
      "UPDATE users SET watch_list = $1 WHERE auth0_id=$2 RETURNING watch_list",
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
    if (isWatched && !watchList?.includes(ticker)) {
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

  public async getHoldings(authKey: string): Promise<Holding[]> {
    const { rows } = await this.pool.query<Holding>(
      "SELECT * FROM transactions WHERE user_id=$1",
      [authKey],
    );
    return rows;
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
    const balance = await this.pool.query<Pick<TUser, "balance">>(
      "SELECT balance FROM users WHERE auth0_id=$1",
      [auth],
    );
    return balance?.rows[0].balance;
  }

  public async setBalance(
    authKey: string,
    newBalance: number,
  ): Promise<number> {
    // update balance retrieve new balance
    const rows = await this.pool.query<Pick<TUser, "balance">>(
      "UPDATE users SET balance = balance - $1 WHERE auth0_id=$2 RETURNING balance",
      [newBalance, authKey],
    );
    return rows.rows[0]?.balance;
  }
}
