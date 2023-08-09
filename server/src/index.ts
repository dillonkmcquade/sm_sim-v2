import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import { connectToDatabase } from "./services/database.service";
import { queryTickerByName } from "./handlers/queryTickerByName";

import userRouter from "./routes/user";
import transactionRouter from "./routes/transaction";
import stockRouter from "./routes/stock";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3001;

connectToDatabase()
  .then(() => {
    server
      .use(express.json())
      .use(helmet())
      .use(morgan("dev"))
      .use(cors({ origin: process.env.ALLOWED_ORIGIN }))
      .use("/stock", stockRouter)
      //Auth required
      .use("/user", userRouter)

      .use("/transaction", transactionRouter)

      .get("/search", queryTickerByName)
      .get("*", (_req, res) => {
        return res.sendStatus(200);
      });

    server.listen(PORT, () => {
      console.log("Listening on port %d", PORT);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exitCode = 1;
  });
