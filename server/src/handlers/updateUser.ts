"use strict";
import { Response, Request } from "express";
import type { Update } from "../types";
import type UserController from "../controllers/UserController";

export const updateUser = async (
  req: Request,
  res: Response,
  UserController: UserController,
) => {
  const auth = req.auth?.payload.sub;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "No update paramaters given.",
      data: req.body,
    });
  }

  //limit the updateable user fields
  function validated(obj: any): boolean {
    const dummyData: Update = {
      name: "string",
      nickname: "string",
      email: "string",
      address: "string",
      telephone: "string",
    };
    let result = true;
    const keys = Object.keys(obj);
    const expectedKeys = Object.keys(dummyData);
    keys.forEach((key: string) => {
      if (!expectedKeys.includes(key) || typeof obj[key] !== "string") {
        result = false;
      }
    });
    return result;
  }
  if (!validated(req.body)) {
    return res.status(400).json({
      status: 400,
      message: "Bad request, unrecognized properties of request body",
    });
  }

  try {
    await UserController.updateUser(req, auth!);
    return res.status(200).json({
      status: 200,
      message: "User updated successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Server error", data: req.body });
  }
};
