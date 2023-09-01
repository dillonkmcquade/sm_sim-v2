import { Router } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { sellStock } from "../handlers/sellStock";
import { pool } from "../index";
import UserController from "../models/UserController";
import { StockController } from "../models/StockController";
import { Transaction } from "../models/Transaction";

const transactionRouter = Router();
const userController = new UserController(pool);
const stockController = new StockController(pool);

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

transactionRouter.use(jwtCheck);

transactionRouter.patch("/buy/:id", async (req, res) => {
  const { id } = req.params;
  const auth = req.auth?.payload.sub as string;
  const { quantity }: { quantity: number } = req.body;
  if (!id || quantity === 0) {
    return res.status(400).json({
      status: 400,
      data: req.body,
      params: id,
      message: "missing data",
    });
  }
  try {
    //fetch current price
    const quote = await stockController.quote(id);
    const currentPrice = quote["c"];
    const amountToSubtract = Number(currentPrice) * quantity;

    //get user balance so we can see if they have enough money
    const balance = await userController.getBalance(auth);

    // return undefined if user doesn't have enough money
    if (balance < amountToSubtract) {
      return res
        .status(400)
        .json({ status: 400, message: "Insufficient funds" });
    }

    //if user has enough money to make the transaction, continue
    const transaction = new Transaction(id, quantity, currentPrice, auth);
    await userController.insertTransaction(transaction);

    // buy stock
    const newBalance = await userController.updateBalance(
      auth,
      amountToSubtract,
    );

    // return error if insufficient funds
    if (!newBalance) {
      return res
        .status(400)
        .json({ status: 400, message: "Insufficient funds" });
    }
    return res.status(200).json({
      status: 200,
      message: "stock purchased successfully",
      balance: newBalance,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

transactionRouter.patch("/sell/:id", async (req, res) => {
  const { id } = req.params;
  const auth = req.auth?.payload.sub as string;
  const { quantity }: { quantity: number } = req.body;
  if (!id || quantity === 0) {
    return res.status(400).json({
      status: 400,
      data: req.body,
      params: id,
      message: "missing data",
    });
  }
  try {
    //check if user has enough shares to sell desired amount
    const holdings = await userController.getHoldings(auth);
    const numOfShares = holdings.reduce((accumulator, currentValue) => {
      if (currentValue.symbol === id) {
        return accumulator + currentValue.quantity;
      } else {
        return accumulator + 0;
      }
    }, 0);

    if (numOfShares < quantity) {
      return res.status(404).json({
        status: 404,
        message: "You don't own enough shares to sell this much",
      });
    }

    //fetch current price
    const quote = await stockController.quote(id);
    const currentPrice = quote["c"];

    //insert transaction to DB

    const transaction = new Transaction(id, -quantity, currentPrice, auth);
    await userController.insertTransaction(transaction);

    //update user balance, !!! amountToAdd must be negative
    const amountToAdd = quantity * currentPrice;
    const newBalance = await userController.updateBalance(auth, -amountToAdd);

    return res.status(200).json({
      status: 200,
      message: "stock sold successfully",
      balance: newBalance,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

export default transactionRouter;
