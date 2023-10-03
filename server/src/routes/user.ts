import { auth } from "express-oauth2-jwt-bearer";
import { Router } from "express";
import { userService, transactionService } from "../index";
import { User } from "../models/User";
import { validated } from "../utils/validateBody";

const userRouter = Router();

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

userRouter.use(jwtCheck);

userRouter.post("/", async (req, res) => {
  const { user } = req.body;
  const auth = req.auth!;
  if (!user) {
    return res.status(400).json({ status: 400, message: "missing user UUID" });
  }
  try {
    let data: User;
    const duplicate = await userService.getUser(auth.payload.sub!);
    if (duplicate) {
      return res.status(200).json({
        status: 200,
        message: "User authenticated",
        data: duplicate,
      });
    } else {
      data = await userService.createUser(user);
    }
    return res.status(201).json({
      status: 201,
      message: "User created",
      data,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

userRouter.get("/", async (req, res) => {
  const auth = req.auth?.payload.sub;
  try {
    const user = userService.getUser(auth!);
    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ status: 500, message: error.message });
  }
});

userRouter.get("/holdings", async (req, res) => {
  const auth = req.auth?.payload.sub;

  try {
    const holdings = await transactionService.getTransactions(auth!);
    return res
      .status(200)
      .json({ status: 200, message: "success", data: holdings });
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
  const auth = req.auth?.payload.sub;
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
    await userService.updateUser(req, auth!);
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
  const sub = req.auth?.payload.sub;
  try {
    await userService.deleteUser(sub!);
    return res.status(200).json({ status: 200, message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

export default userRouter;
