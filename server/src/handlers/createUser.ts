"use strict";
import { Response, Request } from "express";
import type UserController from "../controllers/UserController";

export const createUser = async (
  req: Request,
  res: Response,
  UserController: UserController,
) => {
  const { user } = req.body;
  const auth = req.auth!;
  if (!user) {
    return res.status(400).json({ status: 400, message: "missing user UUID" });
  }
  try {
    let data;
    const duplicate = await UserController.getUser(auth.payload.sub!);
    if (duplicate) {
      return res.status(200).json({
        status: 200,
        message: "User authenticated",
        data: duplicate,
      });
    } else {
      data = await UserController.createUser(auth.payload.sub!, user);
    }
    return res.status(201).json({
      status: 201,
      message: "User created",
      data,
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};
