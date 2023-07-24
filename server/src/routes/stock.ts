import { Router } from "express";
import { getQuote } from "../handlers/getQuote";
import { getCandle } from "../handlers/getCandle";
import { getNews } from "../handlers/getNews";

const stockRouter = Router();

stockRouter
  .get("/news/:ticker", getNews)
  .get("/quote/:ticker", getQuote)
  .get("/candle/:ticker", getCandle);

export default stockRouter;
