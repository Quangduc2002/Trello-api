import express from "express";
const authRouter = express.Router();

import { authController } from "../controller/authController.js";

authRouter.get("/logout", authController.logout);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/login", authController.login);

export default authRouter;
