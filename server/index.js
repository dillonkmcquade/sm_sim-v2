const express = require("express");
const morgan = require("morgan");
const { getTickers } = require("./handlers/getTickers");
const { getTickerById } = require("./handlers/getTickerById");
require("dotenv").config();

const server = express();

server
  .use(express.json())
  .use(morgan("dev"))
  .get("/getTickers", getTickers)
  .get("/getTickers/:id", getTickerById)
  .get("*", (_req, res) => {
    return res.send("<h1>Does not exist</h1>");
  });

server.listen(process.env.PORT, () => {
  console.log("Listening on port %d", process.env.PORT);
});
