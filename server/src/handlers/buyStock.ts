"use strict";
import { Response, Request } from "express";
import type UserController from "../controllers/UserController";
import type { StockController } from "../controllers/StockController";

export const buyStock = async (
  req: Request,
  res: Response,
  UserController: UserController,
  StockController: StockController,
) => {
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
    const quote = await StockController.quote(id);
    const currentPrice = quote["c"];
    const amountToSubtract = Number(currentPrice) * quantity;

    //get user balance so we can see if they have enough money
    const balance = await UserController.getBalance(auth);

    // return undefined if user doesn't have enough money
    if (balance < amountToSubtract) {
      return res
        .status(400)
        .json({ status: 400, message: "Insufficient funds" });
    }

    //if user has enough money to make the transaction, continue
    await UserController.insertTransaction(auth, id, quantity, currentPrice);

    // buy stock
    const newBalance = await UserController.updateBalance(
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
};
