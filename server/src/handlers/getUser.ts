"use strict";
import { Response, Request } from "express";
import type UserController from "../controllers/UserController";

export const getUser = async (
  req: Request,
  res: Response,
  UserController: UserController,
) => {
  const auth = req.auth?.payload.sub;
  try {
    const user = UserController.getUser(auth!);
    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};
