import express from "express";
import morgan from "morgan";
import "dotenv/config";
import helmet from "helmet";
import cors from "cors";

import userRouter from "./routes/user";
import transactionRouter from "./routes/transaction";
import stockRouter from "./routes/stock";
import { Pool } from "pg";

const app = express();
const PORT = process.env.PORT || 3001;

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: 5432,
  database: "marketsim",
  user: "postgres",
  password: process.env.POSTGRES_PASSWORD,
});

pool
  .connect()
  .then(() => {
    console.log(`Successfully connected to database: marketsim`);
    app
      .use(express.json())
      .use(helmet())
      .use(morgan("dev"))
      .use(cors({ origin: process.env.ALLOWED_ORIGIN }))
      .use("/stock", stockRouter)

      //Auth required
      .use("/user", userRouter)
      .use("/transaction", transactionRouter)

      .get("*", (_req, res) => {
        return res.sendStatus(200);
      });

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
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exitCode = 1;
  });
