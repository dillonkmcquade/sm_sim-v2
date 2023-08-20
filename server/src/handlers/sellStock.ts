"use strict";
import { Response, Request } from "express";
import { getPrice } from "../utils";
import UserController from "../controllers/UserController";

export const sellStock = async (
  req: Request,
  res: Response,
  UserController: UserController,
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
    const currentPrice = await getPrice(id);

    //check if user has enough shares to sell desired amount
    const holdings = await UserController.getHoldings(auth);
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

    //insert transaction to DB
    await UserController.insertTransaction(auth, id, -quantity, currentPrice);

    //update user balance, amountToAdd is negative to because the DB
    //query is 'SET balance = balance - $1'
    const amountToAdd = quantity * currentPrice;
    const newBalance = await UserController.updateBalance(auth, -amountToAdd);

    return res.status(200).json({
      status: 200,
      message: "stock sold successfully",
      balance: newBalance,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};
