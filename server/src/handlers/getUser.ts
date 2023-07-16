import * as mongodb from "mongodb";
import { Response, Request } from "express";
import { collections } from "../services/database.service";

export const getUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  if (!_id) {
    return res
      .status(400)
      .json({ status: 400, message: "No query string given" });
  }
  try {
    const { users } = collections;
    const user = await users.findOne({ _id: new mongodb.ObjectId(_id) });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error" });
  }
};
