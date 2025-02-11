import express from "express";
const userRouter = express.Router();

import { userController } from "../controller/userController.js";
import { authMiddleware } from "../middleware/JWTAction.js";

userRouter.post("/", userController.createUser);
userRouter.get("/", authMiddleware, userController.getProfile);

export default userRouter;
