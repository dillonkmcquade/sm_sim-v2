"use strict";
import { Response, Request } from "express";
import { db } from "../services/database.service";

export const createUser = async (req: Request, res: Response) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).json({ status: 400, message: "missing user UUID" });
  }
  try {
    let data;
    const duplicate = await db.query("SELECT * FROM users WHERE auth0_id=$1", [
      user.sub,
    ]);
    if (duplicate.rowCount) {
      data = duplicate;
      return res.status(200).json({
        status: 200,
        message: "User authenticated",
        data: data.rows[0],
      });
    } else {
      data = await db.query(
        "INSERT INTO users (name, email, nickname, picture, balance, watch_list, created_at, auth0_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          user.name,
          user.email,
          user.nickname,
          user.picture,
          1000000,
          [],
          new Date(),
          user.sub,
        ],
      );
    }
    return res.status(201).json({
      status: 201,
      message: "User created",
      data: data.rows[0],
    });
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
};
