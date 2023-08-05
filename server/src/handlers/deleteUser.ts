"use strict";
import { Response, Request } from "express";
import { pool } from "../services/database.service";

export const deleteUser = async (req: Request, res: Response) => {
  const sub = req.auth?.payload.sub;
  try {
    await pool.query("DELETE FROM transactions WHERE transaction_id=$1", [sub]);
    await pool.query("DELETE FROM users WHERE auth0_id=$1", [sub]);
    return res.status(200).json({ status: 200, message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};
