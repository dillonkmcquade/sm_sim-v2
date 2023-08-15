import { Request, Response } from "express";
import type UserController from "../controllers/UserController";

export async function getHoldings(
  req: Request,
  res: Response,
  UserController: UserController,
) {
  const auth = req.auth?.payload.sub;

  try {
    const holdings = await UserController.getHoldings(auth!);
    return res
      .status(200)
      .json({ status: 200, message: "success", data: holdings });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
}
