import express from "express";
import morgan from "morgan";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";

import userRouter from "./routes/user";
import transactionRouter from "./routes/transaction";
import stockRouter from "./routes/stock";
import { Pool } from "pg";
import { StockController } from "./models/StockController";
import UserController from "./models/UserController";

const PORT = process.env.PORT || 3001;

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: "marketsim",
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
});

export const userController = new UserController(pool);
export const stockController = new StockController(pool);

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
