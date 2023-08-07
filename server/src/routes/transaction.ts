import { Router } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { buyStock } from "../handlers/buyStock";
import { sellStock } from "../handlers/sellStock";

const transactionRouter = Router();
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

transactionRouter
  .use(jwtCheck)
  .patch("/buy/:id", buyStock)
  .patch("/sell/:id", sellStock);

export default transactionRouter;
