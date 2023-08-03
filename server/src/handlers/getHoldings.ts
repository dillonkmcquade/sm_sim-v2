import { Request, Response } from "express";
import { db } from "../services/database.service";

export async function getHoldings(req: Request, res: Response) {
  const auth = req.auth?.payload;

  try {
    const { rows } = await db.query(
      "SELECT * FROM transactions WHERE transaction_id=$1",
      [auth?.sub],
    );

    return res
      .status(200)
      .json({ status: 200, message: "success", data: rows });
  } catch (error) {
    if (error instanceof Error) {
      return console.log(error.message);
    }
  }
}
