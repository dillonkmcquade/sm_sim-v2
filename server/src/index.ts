import express from "express";
import morgan from "morgan";
import * as dotenv from "dotenv";

import { connectToDatabase } from "./services/database.service";
import { auth } from "express-oauth2-jwt-bearer";
import { queryTickerByName } from "./handlers/queryTickerByName";
import { createUser } from "./handlers/createUser";
import { getUser } from "./handlers/getUser";
import { buyStock } from "./handlers/buyStock";
import { sellStock } from "./handlers/sellStock";
import { toggleWatchList } from "./handlers/toggleWatchList";
import { updateUser } from "./handlers/updateUser";
import { deleteUser } from "./handlers/deleteUser";

dotenv.config();

const server = express();

const jwtCheck = auth({
  audience: "my-api",
  issuerBaseURL: "https://dev-twp4lk0d7utxiu7i.us.auth0.com/",
});

connectToDatabase()
  .then(() => {
    server
      .use(express.json())
      .use(morgan("dev"))
      .use(function (_req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
        next();
      })
      .get("/search", queryTickerByName)

      //Auth required
      .post("/user", jwtCheck, createUser)
      .delete("/user", jwtCheck, deleteUser)
      .get("/user/:_id", jwtCheck, getUser)
      .patch("/user/update/:_id", jwtCheck, updateUser)
      .patch("/buy/:id", jwtCheck, buyStock)
      .patch("/sell/:id", jwtCheck, sellStock)
      .patch("/toggleWatchList", jwtCheck, toggleWatchList)

      .get("*", (_req, res) => {
        return res.send("<h1>Does not exist</h1>");
      });

    server.listen(process.env.PORT, () => {
      console.log("Listening on port %d", process.env.PORT);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
