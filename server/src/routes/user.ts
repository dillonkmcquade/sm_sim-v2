import { Router } from "express";
import { createUser } from "../handlers/createUser";
import { deleteUser } from "../handlers/deleteUser";
import { updateUser } from "../handlers/updateUser";
import { getUser } from "../handlers/getUser";
import { toggleWatchList } from "../handlers/toggleWatchList";

const userRouter = Router();

userRouter.post("/", createUser);
userRouter.delete("/", deleteUser);
userRouter.patch("/update/:_id", updateUser);
userRouter.get("/:_id", getUser);
userRouter.patch("/toggleWatchList", toggleWatchList);

export default userRouter;
