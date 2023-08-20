import { Router } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { buyStock } from "../handlers/buyStock";
import { sellStock } from "../handlers/sellStock";
import UserController from "../controllers/UserController";
import { pool } from "../services/database.service";

const transactionRouter = Router();
const userController = new UserController(pool);

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

transactionRouter
  .use(jwtCheck)
  .patch("/buy/:id", (req, res) => buyStock(req, res, userController))
  .patch("/sell/:id", (req, res) => sellStock(req, res, userController));

export default transactionRouter;
