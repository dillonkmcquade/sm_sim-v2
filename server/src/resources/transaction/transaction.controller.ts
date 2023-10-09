import { Router } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import {
  Purchase,
  Sale,
  TransactionBuilder,
} from "./models/transaction.entity";
import { stockService, transactionService, userService } from "../../index";

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
    const user = await userService.findById(userId);
    if (!user) {
      return res.status(400).json({ status: 400, error: "User not found" });
    }
    //fetch current price
    const quote = await stockService.quote(id);
    const currentPrice = quote["c"];

    // Create transaction builder that will return the specified transaction once complete
    const transactionBuilder = new TransactionBuilder(type);

    // Build the transaction
    const transaction = transactionBuilder
      .addQuantity(quantity)
      .addPrice(currentPrice)
      .addSymbol(id)
      .addUserId(user)
      .getTransaction();

    // Verify if user can make the transaction before continuing
    let verified = false;

    if (transaction instanceof Purchase) {
      verified = transaction.verify();
    }

    if (transaction instanceof Sale) {
      const numShares = await transactionService.numShares(userId, id);
      verified = transaction.verify(numShares);
    }

    if (!verified) {
      return res.status(400).json({
        status: 400,
        message:
          "You can not make this transaction, either not enough shares or insufficient funds",
      });
    }

    // Update user balance
    await userService.setBalance(userId, transaction.getTotalPrice());

    //Insert transaction
    await transactionService.insert(transaction);

    return res.status(200).json({
      status: 200,
      message: "stock purchased successfully",
      balance: user.balance - transaction.getTotalPrice(),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

export default transactionRouter;
