import { auth } from "express-oauth2-jwt-bearer";
import { Router } from "express";
import { createUser } from "../handlers/createUser";
import { deleteUser } from "../handlers/deleteUser";
import { updateUser } from "../handlers/updateUser";
import { toggleWatchList } from "../handlers/toggleWatchList";
import { getUser } from "../handlers/getUser";
import { getHoldings } from "../handlers/getHoldings";

const userRouter = Router();

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_DOMAIN,
});
userRouter
  .use(jwtCheck)
  .post("/", createUser)
  .get("/", getUser)
  .get("/holdings", getHoldings)
  .patch("/toggleWatchList", toggleWatchList)
  .patch("/update", updateUser)
  .delete("/", deleteUser);

export default userRouter;
