import express from "express";
const userRouter = express.Router();

import { userController } from "../controller/userController.js";
import { authMiddleware } from "../middleware/JWTAction.js";

userRouter.put(
  "/:id/change-password",
  authMiddleware,
  userController.changePassword
);
userRouter.put("/:id/update", authMiddleware, userController.updateUser);
userRouter.post("/", userController.createUser);
userRouter.get("/", authMiddleware, userController.getProfile);

export default userRouter;
