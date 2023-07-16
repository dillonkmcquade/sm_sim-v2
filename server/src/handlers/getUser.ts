"use strict";
import { Response, Request } from "express";
import { collections } from "../services/database.service";

export const getUser = async (req: Request, res: Response) => {
  const id = req?.params?._id;
  if (!req.params._id) {
    return res
      .status(400)
      .json({ status: 400, message: "No query string given" });
  }
  try {
    const { users } = collections;
    if (!users) {
      return;
    }
    const query = { sub: id };
    const user = await users.findOne(query);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
