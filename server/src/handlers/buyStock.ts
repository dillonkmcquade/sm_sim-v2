"use strict";
import { Response, Request } from "express";
import { pool } from "../services/database.service";
import type { User } from "../types";

export const buyStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.auth?.payload;
  const { quantity, currentPrice }: { quantity: number; currentPrice: number } =
    req.body;
  if (!id || !currentPrice || quantity === 0) {
    return res.status(400).json({
      status: 400,
      data: req.body,
      params: id,
      message: "missing data",
    });
  }
  const client = await pool.connect();
  try {
    const amountToSubtract = Number(currentPrice) * quantity;
    await client.query("BEGIN");
    const balance = await client.query<Pick<User, "balance">>(
      "SELECT balance FROM users WHERE auth0_id=$1",
      [payload?.sub],
    );
    if (balance.rows[0].balance > amountToSubtract) {
      await client.query(
        "INSERT INTO transactions (transaction_id, symbol, quantity, price) VALUES ($1, $2, $3, $4)",
        [payload?.sub, id, quantity, currentPrice],
      );
      const update = await client.query<Pick<User, "balance">>(
        "UPDATE users SET balance = $1 RETURNING balance",
        [balance.rows[0].balance - amountToSubtract],
      );
      await client.query("COMMIT");
      return res.status(200).json({
        status: 200,
        message: "stock purchased successfully",
        balance: update.rows[0].balance,
      });
    } else {
      await client.query("ROLLBACK");
      return res
        .status(400)
        .json({ status: 400, message: "Insufficient funds" });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ status: 500, message: "Server error" });
  } finally {
    client.release();
  }
};
