"use strict";
import { Response, Request } from "express";
import { pool } from "../services/database.service";
import { Holding, User } from "../types";
import { getPrice } from "../utils";

export const sellStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.auth?.payload;
  const { quantity }: { quantity: number } = req.body;
  if (!id || quantity === 0) {
    return res.status(400).json({
      status: 400,
      data: req.body,
      params: id,
      message: "missing data",
    });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    //fetch current price
    const currentPrice = await getPrice(id);
    const amountToSubtract = Number(currentPrice) * quantity;

    //check if user has enough shares to sell desired amount
    const { rows } = await client.query<Holding>(
      "SELECT * FROM transactions WHERE transaction_id=$1",
      [payload?.sub],
    );
    const numOfShares = rows.reduce((accumulator, currentValue) => {
      if (currentValue.symbol === id) {
        return accumulator + currentValue.quantity;
      } else {
        return accumulator + 0;
      }
    }, 0);
    if (numOfShares < quantity) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        status: 404,
        message: "You don't own enough shares to sell this much",
      });
    }

    //update user balance
    const update = await client.query<Pick<User, "balance">>(
      "UPDATE users SET balance = balance + $1 RETURNING balance",
      [amountToSubtract],
    );

    //create new transaction
    await client.query(
      "INSERT INTO transactions (transaction_id, symbol, quantity, price) VALUES ($1, $2, $3, $4)",
      [payload?.sub, id, -quantity, currentPrice],
    );

    client.query("COMMIT");
    return res.status(200).json({
      status: 200,
      message: "stock sold successfully",
      balance: update.rows[0].balance,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  } finally {
    client.release();
  }
};
