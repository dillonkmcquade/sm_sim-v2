import { Router } from "express";
import { getQuote } from "../handlers/getQuote";
import { getCandle } from "../handlers/getCandle";
import { getNews } from "../handlers/getNews";
import { StockController } from "../controllers/StockController";

const stockRouter = Router();
const stockController = new StockController();

stockRouter
  .get("/news/:ticker", (req, res) => getNews(req, res, stockController))
  .get("/quote/:ticker", (req, res) => getQuote(req, res, stockController))
  .get("/candle/:ticker", (req, res) => getCandle(req, res, stockController));

export default stockRouter;
