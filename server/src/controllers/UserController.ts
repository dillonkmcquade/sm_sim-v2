import type { Pool } from "pg";
import type { Request } from "express";
import format from "pg-format";

interface User {
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
  [key: string]: any;
}

interface Holding {
  transaction_id: string;
  quantity: number;
  symbol: string;
  price: number;
}

export default class UserController {
  private pool: Pool;

  constructor(db: Pool) {
    this.pool = db;
  }

  public async createUser(authKey: string, user: User): Promise<User> {
    const data = await this.pool.query<User>(
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
        authKey,
      ],
    );
    return data.rows[0];
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
      await client.query("DELETE FROM transactions WHERE transaction_id=$1", [
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
    const data = await this.pool.query<User>(
      "SELECT * FROM users WHERE auth0_id=$1",
      [authKey],
    );
    if (data.rowCount) {
      return data.rows[0];
    } else {
      return undefined;
    }
  }

  private async getWatchList(authKey: string): Promise<string[]> {
    const query = await this.pool.query(
      "SELECT watch_list from users where auth0_id=$1",
      [authKey],
    );
    return query.rows[0].watch_list;
  }

  private async addToWatchList(
    authKey: string,
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
      [ticker, authKey],
    );
    return query.rows[0].watch_list;
  }

  private async removeFromWatchList(
    authKey: string,
    watchList: string[],
  ): Promise<string[]> {
    // overwrite old watch list with new watch list
    const query = await this.pool.query<{ watch_list: string[] }>(
      "UPDATE users SET watch_list = $1 WHERE auth0_id=$2 RETURNING watch_list",
      [watchList, authKey],
    );

    return query.rows[0].watch_list;
  }

  public async toggleWatchList(
    authKey: string,
    isWatched: boolean,
    ticker: string,
  ): Promise<string[] | undefined> {
    let result;
    const watchList = await this.getWatchList(authKey);

    if (isWatched && !watchList.includes(ticker)) {
      //Add
      result = await this.addToWatchList(authKey, ticker);
    } else if (!isWatched && watchList.includes(ticker)) {
      //Remove
      watchList.splice(watchList.indexOf(ticker));
      result = this.removeFromWatchList(authKey, watchList);
    } else {
      //Do nothing
      return;
    }
    return result;
  }

  public async getHoldings(authKey: string): Promise<Holding[]> {
    const { rows } = await this.pool.query<Holding>(
      "SELECT * FROM transactions WHERE transaction_id=$1",
      [authKey],
    );
    return rows;
  }

  public async insertTransaction(
    authKey: string,
    id: string,
    quantity: number,
    currentPrice: number,
  ): Promise<void> {
    await this.pool.query(
      "INSERT INTO transactions (transaction_id, symbol, quantity, price) VALUES ($1, $2, $3, $4)",
      [authKey, id, quantity, currentPrice],
    );
  }

  public async getBalance(authKey: string): Promise<number> {
    const balance = await this.pool.query<Pick<User, "balance">>(
      "SELECT balance FROM users WHERE auth0_id=$1",
      [authKey],
    );
    return balance?.rows[0].balance;
  }

  public async updateBalance(
    authKey: string,
    newBalance: number,
  ): Promise<number> {
    // update balance retrieve new balance
    const rows = await this.pool.query<Pick<User, "balance">>(
      "UPDATE users SET balance = balance - $1 WHERE auth0_id=$2 RETURNING balance",
      [newBalance, authKey],
    );
    return rows.rows[0]?.balance;
  }
}
