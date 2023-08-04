"use strict";
import { Response, Request } from "express";
import { pool } from "../services/database.service";

export const toggleWatchList = async (req: Request, res: Response) => {
  const { ticker, isWatched }: { ticker: string; isWatched: boolean } =
    req.body;
  const auth = req.auth?.payload;
  if (!ticker || isWatched === undefined) {
    return res.status(400).json({
      status: 400,
      data: req.body,
      message: "missing data",
    });
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let result;
    const getWatchList = await client.query(
      "SELECT watch_list from users where auth0_id=$1",
      [auth?.sub],
    );
    const watchList = getWatchList.rows[0].watch_list;
    if (isWatched && !watchList.includes(ticker)) {
      //Add
      result = await client.query(
        "UPDATE users SET watch_list = array_append(watch_list, $1) WHERE auth0_id=$2 RETURNING watch_list",
        [ticker, auth?.sub],
      );
    } else if (!isWatched && watchList.includes(ticker)) {
      //Remove
      watchList.splice(watchList.indexOf(ticker));
      result = await client.query(
        "UPDATE users SET watch_list = $1 WHERE auth0_id=$2 RETURNING watch_list",
        [watchList, auth?.sub],
      );
    } else {
      //Do nothing
      await client.query("ROLLBACK");
      return res.status(200).json({ status: 200, message: "Not modified" });
    }
    await client.query("COMMIT");
    return res.status(200).json({
      status: 200,
      message: "Watch list updated successfully",
      data: result?.rows[0],
    });
  } catch (error) {
    if (error instanceof Error) {
      await client.query("ROLLBACK");
      return res
        .status(500)
        .json({ status: 500, message: "Server error", data: error.message });
    }
    return;
  } finally {
    client.release();
  }
};
