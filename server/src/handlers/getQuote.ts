import { Response, Request } from "express";
import "dotenv/config";
import type { StockController } from "../controllers/StockController";
export async function getQuote(
  req: Request,
  res: Response,
  StockController: StockController,
) {
  const { ticker } = req.params;
  if (!ticker) {
    return res.status(400).json({ status: 400, message: "Missing ticker id" });
  }
  try {
    const quote = await StockController.quote(ticker);
    if (quote) {
      return res.status(200).json({ status: 200, data: quote });
    } else {
      return res.status(404).json({
        status: 404,
        message: "Failed request, possibly incorrect ticker symbol",
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
    return;
  }
}
