import * as mongodb from "mongodb";
import { Response, Request } from "express";
import { collections } from "../services/database.service";

export const updateUser = async (req: Request, res: Response) => {
  const { _id } = req.params;
  if (!_id) {
    return res.status(400).json({ status: 400, message: "Missing client ID" });
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "No update paramaters given.",
      data: req.body,
    });
  }

  try {
    const { users } = collections;
    const update = await users.updateOne(
      { _id: new mongodb.ObjectId(_id) },
      { $set: req.body }
    );
    if (update.matchedCount === 0 || update.modifiedCount === 0) {
      return res.status(404).json({
        status: 404,
        message: "Invalid data given. Check variable names in request body",
      });
    }

    const newUser = await users.findOne({ _id: new mongodb.ObjectId(_id) });

    return res.status(200).json({
      status: 200,
      message: "User updated successfully.",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Server error" });
  }
};
