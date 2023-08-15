import { auth } from "express-oauth2-jwt-bearer";
import { Router } from "express";
import { createUser } from "../handlers/createUser";
import { deleteUser } from "../handlers/deleteUser";
import { updateUser } from "../handlers/updateUser";
import { toggleWatchList } from "../handlers/toggleWatchList";
import { getUser } from "../handlers/getUser";
import { getHoldings } from "../handlers/getHoldings";
import UserController from "../controllers/UserController";
import { pool } from "../services/database.service";

const userRouter = Router();
const userController = new UserController(pool);

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});

userRouter
  .use(jwtCheck)
  .post("/", (req, res) => createUser(req, res, userController))
  .get("/", (req, res) => getUser(req, res, userController))
  .get("/holdings", (req, res) => getHoldings(req, res, userController))
  .patch("/toggleWatchList", (req, res) =>
    toggleWatchList(req, res, userController),
  )
  .patch("/update", (req, res) => updateUser(req, res, userController))
  .delete("/", (req, res) => deleteUser(req, res, userController));

export default userRouter;
