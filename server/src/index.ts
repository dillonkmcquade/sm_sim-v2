import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";

import { auth } from "express-oauth2-jwt-bearer";

import { connectToDatabase } from "./services/database.service";
import { queryTickerByName } from "./handlers/queryTickerByName";

import userRouter from "./routes/user";
import transactionRouter from "./routes/transaction";
import stockRouter from "./routes/stock";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3001;

const jwtCheck = auth({
  audience: "my-api",
  issuerBaseURL: "https://dev-twp4lk0d7utxiu7i.us.auth0.com/",
});

connectToDatabase()
  .then(() => {
    server
      .use(express.json())
      .use(helmet())
      .use(compression())
      .use(morgan("dev"))
      .use(function (_req, res, next) {
        res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
        res.header(
          "Access-Control-Allow-Headers",
          "Content-Type, Accept, Authorization",
        );
        res.header(
          "Access-Control-Allow-Methods",
          "OPTIONS, GET, POST, PATCH, DELETE",
        );
        next();
      })

      .use("/stock", stockRouter)

      //Auth required
      .use("/user", jwtCheck, userRouter)
      .use("/transaction", jwtCheck, transactionRouter)

      .get("/search", queryTickerByName)
      .get("*", (_req, res) => {
        return res.send("<h1>Does not exist</h1>");
      });

    server.listen(PORT, () => {
      console.log("Listening on port %d", PORT);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
