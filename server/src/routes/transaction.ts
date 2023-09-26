import { Router } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { userService, stockService } from "../index";
import { Purchase, Sale } from "../models/Transaction";

const transactionRouter = Router();

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

transactionRouter.use(jwtCheck);

transactionRouter.patch("/buy/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.auth?.payload.sub as string;
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
    const quote = await stockService.quote(id);
    const currentPrice = quote["c"];
    const amountToSubtract = Number(currentPrice) * quantity;

    //get user balance so we can see if they have enough money
    const balance = await userService.getBalance(userId);

    // return undefined if user doesn't have enough money
    if (balance < amountToSubtract) {
      return res
        .status(400)
        .json({ status: 400, message: "Insufficient funds" });
    }

    //if user has enough money to make the transaction, continue
    const transaction = new Purchase(id, quantity, currentPrice, userId);
    await userService.insertTransaction(transaction);

    // buy stock
    const newBalance = await userService.setBalance(
      userId,
      transaction.getTotalPrice(),
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
    const holdings = await userService.getHoldings(auth);
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
    const quote = await stockService.quote(id);
    const currentPrice = quote["c"];

    //insert transaction to DB

    const transaction = new Sale(id, -quantity, currentPrice, auth);
    await userService.insertTransaction(transaction);

    //update user balance, !!! amountToAdd must be negative
    const newBalance = await userService.setBalance(
      auth,
      transaction.getTotalPrice(),
    );

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
