import express from "express";
import morgan from "morgan";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";

import userRouter from "./resources/user/user.controller";
import transactionRouter from "./resources/transaction/transaction.controller";
import stockRouter from "./resources/stock/stock.controller";
import { DataSource } from "typeorm";
import { StockService } from "./resources/stock/stock.service";
import { User } from "./resources/user/models/User.entity";
import { Ticker } from "./resources/stock/models/ticker.entity";
import { Transaction } from "./resources/transaction/models/transaction.entity";

const PORT = process.env.PORT || 3001;

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: "postgres",
  password: process.env.POSTGRES_PASSWORD,
  database: "marketsim",
  entities: [User, Ticker, Transaction],
  synchronize: true,
});

dataSource
  .initialize()
  .then(() => console.log("Migrations complete"))
  .catch((err) => console.error(err));

export const stockService = new StockService();
// export const userService = new UserService(pool);
// export const transactionService = new TransactionService(pool);

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
