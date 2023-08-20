import { Response, Request } from "express";
import "dotenv/config";
import type { StockController } from "../controllers/StockController";
export async function getNews(
  req: Request,
  res: Response,
  StockController: StockController,
) {
  const { ticker } = req.params;
  if (!ticker) {
    return res.status(400).json({ status: 400, message: "Missing ticker id" });
  }
  try {
    const news = await StockController.news(ticker);
    if (news) {
      return res.status(200).json({ status: 200, data: news });
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
