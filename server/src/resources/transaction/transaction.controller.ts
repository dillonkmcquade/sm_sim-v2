import { Router } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { TransactionBuilder, TransactionType } from "./models/Transaction";
import { stockService, userService, transactionService } from "../../index";

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
    const transactionBuilder = new TransactionBuilder(type as TransactionType);

    // Build the transaction
    transactionBuilder
      .addQuantity(quantity)
      .addPrice(currentPrice)
      .addSymbol(id)
      .addUserId(userId);

    // Create the new transaction
    const transaction = transactionBuilder.getTransaction();

    // Verify if user can make the transaction before continuing
    let verified = false;

    if (type === "buy") {
      const balance = await userService.getBalance(userId);
      verified = transaction.verify(balance);
    }

    if (type === "sell") {
      const numShares = await transactionService.getNumSharesBySymbol(
        userId,
        id,
      );
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
    await transactionService.create(transaction);

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

export default transactionRouter;
