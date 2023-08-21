"use strict";
import { Response, Request } from "express";
import { StockController } from "../controllers/StockController";

export const queryTickerByName = async (
  req: Request,
  res: Response,
  StockController: StockController,
) => {
  const name = req.query.name as string;
  if (!name) {
    return res
      .status(400)
      .json({ status: 400, message: "No query string given" });
  }
  try {
    const results = await StockController.search(name);
    if (!results) {
      return res.status(400).json({ status: 400, message: "Not found" });
    }
    return res.status(200).json({
      status: 200,
      results,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
    return;
  }
};
