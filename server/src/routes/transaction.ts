import { Router } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { userService, stockService } from "../index";
import { TransactionBuilder } from "../models/Transaction";

const transactionRouter = Router();

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

transactionRouter.use(jwtCheck);

transactionRouter.patch("/:type/:id", async (req, res) => {
  const { id, type } = req.params;
  const userId = req.auth?.payload.sub as string;
  const { quantity }: { quantity: number } = req.body;
  const types = ["buy", "sell"];

  if (!id || quantity === 0 || !type || !types.includes(type)) {
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

    // Create transaction builder that will return the specified transaction once complete
    const transactionBuilder = new TransactionBuilder(type);

    transactionBuilder
      .addQuantity(quantity)
      .addPrice(currentPrice)
      .addSymbol(id)
      .addUserId(userId);

    // Create the new transaction
    const transaction = transactionBuilder.getTransaction();

    // Verify if user can make the transaction before continuing
    let verified: boolean = false;

    if (type === "buy") {
      const balance = await userService.getBalance(userId);
      verified = transaction.verify(balance);
    }

    if (type === "sell") {
      const numShares = await userService.getNumSharesBySymbol(userId);
      verified = transaction.verify(numShares);
    }

    if (!verified) {
      return res.status(400).json({
        status: 400,
        message:
          "You can not make this transaction, either not enough shares or insufficient funds",
      });
    }

    //if user has enough money/shares to make the transaction, continue
    await userService.insertTransaction(transaction);

    // update user balance
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

/* transactionRouter.patch("/sell/:id", async (req, res) => {
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
    const quote = await stockService.quote(id);
    const currentPrice = quote["c"];

    //check if user has enough shares to sell desired amount
    // -------------------------------------------------
    // Create custom query for this
    const holdings = await userService.getHoldings(auth);
    const numOfShares = holdings.reduce((accumulator, currentValue) => {
      if (currentValue.symbol === id) {
        return accumulator + currentValue.quantity;
      } else {
        return accumulator + 0;
      }
    }, 0);

    const transaction = transactionFactory.getTransaction(
      id,
      -quantity,
      currentPrice,
      auth,
    );
    if (!transaction.verify(userService, auth)) {
      return res.status(404).json({
        status: 404,
        message: "You don't own enough shares to sell this much",
      });
    }
    // ------------------------------------------------

    //insert transaction to DB

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
}); */

export default transactionRouter;
