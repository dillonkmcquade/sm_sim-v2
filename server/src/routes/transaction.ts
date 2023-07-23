import { Router } from "express";
import { buyStock } from "../handlers/buyStock";
import { sellStock } from "../handlers/sellStock";

const transactionRouter = Router();

transactionRouter.patch("/buy/:id", buyStock);
transactionRouter.patch("/sell/:id", sellStock);

export default transactionRouter;
