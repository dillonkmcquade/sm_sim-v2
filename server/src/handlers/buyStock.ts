"use strict";
import { Response, Request } from "express";
import { collections } from "../services/database.service";
import type { Holding } from "../../../client/src/types";

export const buyStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    _id,
    quantity,
    currentPrice,
  }: { _id: string; quantity: number; currentPrice: number } = req.body;
  if (!id || !currentPrice || !_id) {
    return res.status(400).json({
      status: 400,
      data: req.body,
      params: id,
      message: "missing data",
    });
  }
  try {
    const { users } = collections;
    const user = await users?.findOne({ sub: _id });
    if (!user) {
      return res.status(404).json({ status: 200, message: "user not found" });
    }

    const newHolding: Holding = { ticker: id, quantity, price: currentPrice };
    const amountToSubtract = Number(currentPrice) * quantity;

    if (user.balance < amountToSubtract) {
      return res
        .status(400)
        .json({ status: 400, message: "Insufficient funds" });
    }

    const update = await users?.updateOne(
      { sub: _id },
      { $inc: { balance: -amountToSubtract }, $push: { holdings: newHolding } },
    );

    if (update?.matchedCount === 0 || update?.modifiedCount === 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Could not update user holdings" });
    }
    user.holdings.push(newHolding);
    return res.status(200).json({
      status: 200,
      message: "stock purchased successfully",
      holdings: user.holdings,
      balance: user.balance - amountToSubtract,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};
