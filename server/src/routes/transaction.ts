import { Router } from "express";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import { buyStock } from "../handlers/buyStock";
import { sellStock } from "../handlers/sellStock";

const transactionRouter = Router();
const jwtCheck = auth({
  audience: "my-api",
  issuerBaseURL: "https://dev-twp4lk0d7utxiu7i.us.auth0.com/",
});

transactionRouter
  .use(cors())
  .use(jwtCheck)
  .patch("/buy/:id", buyStock)
  .patch("/sell/:id", sellStock);

export default transactionRouter;
