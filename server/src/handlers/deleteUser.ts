"use strict";
import { Response, Request } from "express";
import type UserController from "../controllers/UserController";

export const deleteUser = async (
  req: Request,
  res: Response,
  UserController: UserController,
) => {
  const sub = req.auth?.payload.sub;
  try {
    await UserController.deleteUser(sub!);
    return res.status(200).json({ status: 200, message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};
