import { auth } from "express-oauth2-jwt-bearer";
import { Router } from "express";
import { transactionService, userService } from "../../index";
import { User } from "./models/User.entity";
import { validated } from "../../utils/validateBody";

const userRouter = Router();

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

userRouter.use(jwtCheck);

userRouter.post("/", async (req, res) => {
  const reqBody = req.body.user;
  const id = req.auth?.payload.sub;
  if (!reqBody) {
    return res.status(400).json({ status: 400, message: "missing user UUID" });
  }
  try {
    let user = await userService.findOne(id!);

    if (user) {
      return res.status(200).json({
        status: 200,
        message: "User authenticated",
        data: user,
      });
    } else {
      user = await userService.create({
        id: id!,
        email: reqBody.email,
        name: reqBody.name,
        nickname: reqBody.nickname,
        picture: reqBody.picture,
        telephone: reqBody.telephone,
      });
    }
    return res.status(201).json({
      status: 201,
      message: "User created",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

userRouter.get("/", async (req, res) => {
  const id = req.auth?.payload.sub;
  try {
    const user = userService.findOne(id!);
    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ status: 500, message: error.message });
    }
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error" });
  }
});

userRouter.get("/holdings", async (req, res) => {
  const id = req.auth?.payload.sub;

  try {
    const transactions = await transactionService.findMany(id!);
    return res
      .status(200)
      .json({ status: 200, message: "success", data: transactions });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

userRouter.patch("/toggleWatchList", async (req, res) => {
  const { ticker, isWatched }: { ticker: string; isWatched: boolean } =
    req.body;
  const auth = req.auth?.payload.sub;
  if (!ticker || isWatched === undefined) {
    return res.status(400).json({
      status: 400,
      data: req.body,
      message: "missing data",
    });
  }
  try {
    const watchList = await userService.toggleWatchList(
      auth!,
      isWatched,
      ticker,
    );
    if (!watchList) {
      return res.status(200).json({ status: 200, message: "Nothing changed" });
    }
    return res.status(200).json({
      status: 200,
      message: "Watch list updated successfully",
      data: watchList,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ status: 500, message: "Server error", data: error.message });
    }
    return;
  }
});

userRouter.patch("/update", async (req, res) => {
  const id = req.auth?.payload.sub;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "No update paramaters given.",
      data: req.body,
    });
  }

  //limit the updateable user fields
  if (!validated(req.body)) {
    return res.status(400).json({
      status: 400,
      message: "Bad request, unrecognized properties of request body",
    });
  }

  try {
    await userService.update(req.body as Partial<User>, id!);
    return res.status(200).json({
      status: 200,
      message: "User updated successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Server error", data: req.body });
  }
});

userRouter.delete("/", async (req, res) => {
  const id = req.auth?.payload.sub;
  try {
    // Must delete transactions first, or else we violate foreign key constraint on transactions
    await transactionService.delete(id!);
    await userService.delete(id!);
    return res.status(200).json({ status: 200, message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

export default userRouter;
