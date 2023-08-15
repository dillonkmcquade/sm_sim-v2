import { Pool } from "pg";
import { Request } from "express";
import type { Holding, User } from "../types";
import format from "pg-format";

export default class UserController {
  private pool: Pool;

  constructor(db: Pool) {
    this.pool = db;
  }

  public async createUser(authKey: string, user: User): Promise<User> {
    const data = await this.pool.query<User>(
      "INSERT INTO users (name, email, nickname, picture, balance, watch_list, created_at, auth0_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
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
    const data = await this.pool.query(
      "SELECT * FROM users WHERE auth0_id=$1",
      [authKey],
    );
    if (data.rowCount) {
      return data.rows[0];
    } else {
      return undefined;
    }
  }

  public async toggleWatchList(
    authKey: string,
    isWatched: boolean,
    ticker: string,
  ): Promise<string[] | undefined> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      let result;

      const getWatchList = await client.query(
        "SELECT watch_list from users where auth0_id=$1",
        [authKey],
      );

      const watchList = getWatchList.rows[0].watch_list;

      if (isWatched && !watchList.includes(ticker)) {
        //Add
        result = await client.query(
          "UPDATE users SET watch_list = array_append(watch_list, $1) WHERE auth0_id=$2 RETURNING watch_list",
          [ticker, authKey],
        );
      } else if (!isWatched && watchList.includes(ticker)) {
        //Remove
        watchList.splice(watchList.indexOf(ticker));

        result = await client.query(
          "UPDATE users SET watch_list = $1 WHERE auth0_id=$2 RETURNING watch_list",
          [watchList, authKey],
        );
      } else {
        //Do nothing
        await client.query("ROLLBACK");

        return;
      }
      await client.query("COMMIT");
      return result.rows[0].watch_list;
    } catch (err) {
      console.log(err);
      await client.query("ROLLBACK");
      return;
    } finally {
      client.release();
    }
  }

  public async getHoldings(authKey: string): Promise<Holding[] | string> {
    try {
      const { rows } = await this.pool.query<Holding>(
        "SELECT * FROM transactions WHERE transaction_id=$1",
        [authKey],
      );
      return rows;
    } catch (err) {
      console.log(err);
      return "Error fetching user";
    }
  }
}
