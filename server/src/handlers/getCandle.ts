import { Response, Request } from "express";
import "dotenv/config";
import type { StockController } from "../controllers/StockController";

export async function getCandle(
  req: Request,
  res: Response,
  StockController: StockController,
) {
  const { ticker } = req.params;
  const { resolution, from } = req.query;
  if (!ticker || !resolution || !from) {
    return res.status(400).json({ status: 400, message: "Missing ticker id" });
  }
  try {
    const candle = await StockController.candle(
      ticker,
      resolution.toString(),
      from.toString(),
    );
    if (candle) {
      return res.status(200).json({ status: 200, data: candle });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Failed request, possibly incorrect ticker symbol",
      });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
}
