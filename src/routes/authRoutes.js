import express from "express";
const authRouter = express.Router();

import { authController } from "../controller/authController.js";

authRouter.get("/logout", authController.logout);
/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh token to service
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "string"
 *     responses:
 *       200:
 *         description:
 */
authRouter.post("/refresh-token", authController.refreshToken);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to service
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "Quangducdev@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Test@1234"
 *     responses:
 *       200:
 *         description:
 */
authRouter.post("/login", authController.login);

export default authRouter;
