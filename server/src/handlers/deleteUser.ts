"use strict";
import { Response, Request } from "express";
import { collections } from "../services/database.service";

export const deleteUser = async (req: Request, res: Response) => {
  const { _id } = req.body;
  if (!_id) {
    return res.status(400).json({ status: 400, message: "Missing client ID" });
  }

  try {
    const { users } = collections;
    const update = await users?.deleteOne({ sub: _id });
    if (update?.deletedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid user id",
      });
    }

    return res.status(200).json({ status: 200, message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};
