import express from "express";
import morgan from "morgan";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";

import userRouter from "./resources/user/user.controller";
import transactionRouter from "./resources/transaction/transaction.controller";
import stockRouter from "./resources/stock/stock.controller";
import { Pool } from "pg";
import { StockService } from "./resources/stock/stock.service";
import { UserService } from "./resources/user/user.service";
import { TransactionService } from "./resources/transaction/transaction.service";

const PORT = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: "marketsim",
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
});

export const stockService = new StockService(pool);
export const userService = new UserService(pool);
export const transactionService = new TransactionService(pool);

const app = express();
// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));

// Routes
app.use("/stock", stockRouter);
//Auth required
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);

//health-check
app.get("/check", async (_, res) => {
  return res.sendStatus(200);
});

// 404
app.get("*", async (_, res) => {
  return res.sendStatus(404);
});

// This is where the app is served
const server = app.listen(PORT, () => {
  console.log("Listening on port %d", PORT);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down...");
  setTimeout(() => {
    server.close(() => {
      process.exit();
    });
  }, 10000);
});
