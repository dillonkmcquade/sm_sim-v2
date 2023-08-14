"use strict";
import { Response, Request } from "express";
import { pool } from "../services/database.service";

export const deleteUser = async (req: Request, res: Response) => {
  const sub = req.auth?.payload.sub;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM transactions WHERE transaction_id=$1", [
      sub,
    ]);
    await client.query("DELETE FROM users WHERE auth0_id=$1", [sub]);
    await client.query("COMMIT");
    return res.status(200).json({ status: 200, message: "Account deleted" });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};
