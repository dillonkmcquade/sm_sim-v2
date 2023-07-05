const express = require("express");
const morgan = require("morgan");
const { auth } = require("express-oauth2-jwt-bearer");
const { getTickers } = require("./handlers/getTickers");
const { getTickerById } = require("./handlers/getTickerById");
const { queryTickerByName } = require("./handlers/queryTickerByName");
const { createUser } = require("./handlers/createUser");
const { getUser } = require("./handlers/getUser");
const { buyStock } = require("./handlers/buyStock");
const { sellStock } = require("./handlers/sellStock");
require("dotenv").config();

const server = express();

const jwtCheck = auth({
  audience: "my-api",
  issuerBaseURL: "https://dev-twp4lk0d7utxiu7i.us.auth0.com/",
});

server
  .use(express.json())
  .use(morgan("dev"))
  .get("/getTickers", getTickers)
  .get("/getTickers/:id", getTickerById)
  .get("/search", queryTickerByName)
  .get("/user/:_id", jwtCheck, getUser)
  .post("/user", jwtCheck, createUser)
  .patch("/buy/:id", jwtCheck, buyStock)
  .patch("/sell/:id", jwtCheck, sellStock)
  .get("*", (_req, res) => {
    return res.send("<h1>Does not exist</h1>");
  });

server.listen(process.env.PORT, () => {
  console.log("Listening on port %d", process.env.PORT);
});
