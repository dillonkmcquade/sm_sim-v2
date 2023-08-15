"use strict";
import { Response, Request } from "express";
import type UserController from "../controllers/UserController";

export const toggleWatchList = async (
  req: Request,
  res: Response,
  UserController: UserController,
) => {
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
    const watchList = await UserController.toggleWatchList(
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
};
