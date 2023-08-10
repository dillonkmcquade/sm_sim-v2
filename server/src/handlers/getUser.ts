"use strict";
import { Response, Request } from "express";
import { pool } from "../services/database.service";
import type { User } from "../types";

export const getUser = async (req: Request, res: Response) => {
  const auth = req.auth;
  try {
    const user = await pool.query<User>(
      "SELECT * from users where auth0_id=$1",
      [auth?.payload.sub],
    );
    return res.status(200).json({
      status: 200,
      data: user.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};
