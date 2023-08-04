"use strict";
import { Response, Request } from "express";
import { pool } from "../services/database.service";
import type { Ticker } from "../types";

export const queryTickerByName = async (req: Request, res: Response) => {
  const name = req.query.name as string;
  if (!name) {
    return res
      .status(400)
      .json({ status: 400, message: "No query string given" });
  }
  try {
    const data = await pool.query<Ticker>(
      "SELECT * FROM tickers WHERE description LIKE $1 LIMIT 10",
      [name.toUpperCase() + "%"],
    );
    if (data.rows.length === 0) {
      return res.status(400).json({ status: 400, message: "Not found" });
    }
    return res.status(200).json({
      status: 200,
      results: data.rows,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};
