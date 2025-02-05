import express from "express";
const userRouter = express.Router();

import { userController } from "../controller/userController.js";
import { checkUserJWT } from "../middleware/JWTAction.js";

userRouter.post("/", userController.createUser);
userRouter.get("/", checkUserJWT, userController.getProfile);

export default userRouter;
