import { auth } from "express-oauth2-jwt-bearer";
import { Router } from "express";
import { User } from "./models/User.entity";
// import { Transaction } from "../transaction/models/transaction.entity";
/* import { validated } from "../../utils/validateBody";
// import { Transaction } from "../transaction/models/transaction.entity"; */

const userRouter = Router();

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

userRouter.use(jwtCheck);

userRouter.post("/", async (req, res) => {
  const userDto = req.body.user;
  const auth = req.auth!;
  if (!userDto) {
    return res.status(400).json({ status: 400, message: "missing user UUID" });
  }
  try {
    let user = await User.findOneBy({ id: auth.payload.sub! });

    if (user) {
      return res.status(200).json({
        status: 200,
        message: "User authenticated",
        data: user,
      });
    } else {
      user = User.create({
        id: userDto.sub,
        email: userDto.email,
        name: userDto.name,
        nickname: userDto.nickname,
        picture: userDto.picture,
        telephone: userDto.telephone,
      });
      await user.save();
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
  const auth = req.auth?.payload.sub;
  try {
    const user = User.findOneBy({ id: auth! });
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
  const auth = req.auth?.payload.sub;

  try {
    /* const user = await User.findOne({
      relations: {
        transactions: true,
      },
      where: {
        id: auth,
      },
    }); */
    const { transactions } = await User.createQueryBuilder("users").select([
      "",
    ]);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    console.log(user);
    return res
      .status(200)
      .json({ status: 200, message: "success", data: user.transactions });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

/* userRouter.patch("/toggleWatchList", async (req, res) => {
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
*/
/* userRouter.patch("/update", async (req, res) => {
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
}); */

userRouter.delete("/", async (req, res) => {
  const sub = req.auth?.payload.sub;
  try {
    const user = await User.findOneBy({ id: sub });
    if (!user) {
      return res.sendStatus(404);
    }
    await user.remove();
    return res.status(200).json({ status: 200, message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
});

export default userRouter;
