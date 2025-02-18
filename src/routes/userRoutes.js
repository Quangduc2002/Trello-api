import express from "express";
const userRouter = express.Router();

import { userController } from "../controller/userController.js";
import { authMiddleware } from "../middleware/JWTAction.js";

/**
 * @swagger
 * /user/{id}/change-password:
 *   put:
 *     summary: Change password of user
 *     security:
 *      - BearerAuth: []
 *     tags: [User]
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               -passwordCurent
 *               -passwordNew
 *             properties:
 *               passwordCurent:
 *                 type: string
 *                 example: "Quangduc2002@"
 *               passwordNew:
 *                 type: string
 *                 example: "Test@1234"
 *     responses:
 *       401:
 *         description: Unauthorized
 */
userRouter.put(
  "/:id/change-password",
  authMiddleware,
  userController.changePassword
);

/**
 * @swagger
 * /user/{id}/update:
 *   put:
 *     summary: Update my profile
 *     security:
 *      - BearerAuth: []
 *     tags: [User]
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - avatar
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phạm Quang Đức"
 *               email:
 *                 type: string
 *                 example: "Test@1234"
 *               avatar:
 *                 type: string
 *                 example: null
 *     responses:
 *       401:
 *         description: Unauthorized
 */

userRouter.put("/:id/update", authMiddleware, userController.updateUser);
/**
 * @swagger
 * /user:
 *   post:
 *     summary: Register account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               -name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phạm Quang Đức"
 *               email:
 *                 type: string
 *                 example: "Quangducdev@gmail.com"
 *               password:
 *                 type: string
 *                 example: "Test@1234"
 *               avatar:
 *                 type: string
 *                 example: null
 *     responses:
 *       200:
 *         description:
 */
userRouter.post("/", userController.createUser);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get my profile
 *     security:
 *      - BearerAuth: []
 *     tags: [User]
 *     responses:
 *       401:
 *         description: Unauthorized
 */
userRouter.get("/", authMiddleware, userController.getProfile);

export default userRouter;
