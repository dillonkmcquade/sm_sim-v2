import { Router } from "express";
import { getQuote } from "../handlers/getQuote";
import { getCandle } from "../handlers/getCandle";
import { getNews } from "../handlers/getNews";
import { StockController } from "../controllers/StockController";
import { queryTickerByName } from "../handlers/queryTickerByName";
import { pool } from "../index";

const stockRouter = Router();
const stockController = new StockController(pool);

stockRouter
  .get("/news/:ticker", (req, res) => getNews(req, res, stockController))
  .get("/quote/:ticker", (req, res) => getQuote(req, res, stockController))
  .get("/candle/:ticker", (req, res) => getCandle(req, res, stockController))
  .get("/search", (req, res) => queryTickerByName(req, res, stockController));

export default stockRouter;
