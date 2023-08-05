"use strict";
import { Response, Request } from "express";
import { pool } from "../services/database.service";
import format from "pg-format";
import type { Update } from "../types";

export const updateUser = async (req: Request, res: Response) => {
  const payload = req.auth!.payload;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "No update paramaters given.",
      data: req.body,
    });
  }

  //limit the updateable user fields
  function isUpdate(obj: any): boolean {
    const dummyData: Update = {
      name: "string",
      nickname: "string",
      email: "string",
      address: "string",
      telephone: "string",
    };
    let result = true;
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const expectedKeys = Object.keys(dummyData);
      if (!expectedKeys.includes(key)) {
        result = false;
      }
    });
    return result;
  }
  if (!isUpdate(req.body)) {
    return res.status(400).json({
      status: 400,
      message: "Bad request, unrecognized properties of request body",
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const keys = Object.keys(req.body);
    const queries = keys.map(async (key) => {
      const sql = format("UPDATE users SET %I = $1 WHERE auth0_id=$2", key);
      await client.query(sql, [req.body[key], payload.sub]);
    });
    await Promise.all(queries);
    await client.query("COMMIT");
    return res.status(200).json({
      status: 200,
      message: "User updated successfully.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ status: 500, message: "Server error", data: req.body });
  }
};
