import { Router } from "express";
import { stockService } from "../../index";

const stockRouter = Router();

stockRouter.get("/news/:ticker", async (req, res) => {
  const { ticker } = req.params;
  if (!ticker) {
    return res.status(400).json({ status: 400, message: "Missing ticker id" });
  }
  try {
    const news = await stockService.news(ticker);
    if (news) {
      return res.status(200).json({ status: 200, data: news });
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
});

stockRouter.get("/quote/:ticker", async (req, res) => {
  const { ticker } = req.params;
  if (!ticker) {
    return res.status(400).json({ status: 400, message: "Missing ticker id" });
  }
  try {
    const quote = await stockService.quote(ticker);
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
});

stockRouter.get("/candle/:ticker", async (req, res) => {
  const { ticker } = req.params;
  const { resolution, from } = req.query;
  if (!ticker || !resolution || !from) {
    return res.status(400).json({ status: 400, message: "Missing ticker id" });
  }
  try {
    const candle = await stockService.candle(
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
    if (error instanceof Error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
    return;
  }
});

stockRouter.get("/search", async (req, res) => {
  const name = req.query?.name as string;
  if (!name) {
    return res
      .status(400)
      .json({ status: 400, message: "No query string given" });
  }
  try {
    const results = await stockService.search(name);
    if (!results) {
      return res.status(400).json({ status: 400, message: "Not found" });
    }
    return res.status(200).json({
      status: 200,
      results,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return res.status(400).json({ status: 400, message: error.message });
    }
    return;
  }
});

export default stockRouter;
