import express from "express";
const boardRouter = express.Router();

import { boardController } from "../controller/boardController.js";
import { authMiddleware } from "../middleware/JWTAction.js";

/**
 * @swagger
 * /board/remove-member:
 *   put:
 *     summary: Remove member in board
 *     security:
 *      - BearerAuth: []
 *     tags: [Board]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *               - memberId
 *             properties:
 *               boardId:
 *                 type: string
 *                 example: 6788e705e8cc644ad74ec930
 *               memberId:
 *                 type: string
 *                 example: 6788e705e8cc644a705e8cc64
 *     responses:
 *       401:
 *         description: Unauthorized
 */
boardRouter.put(
  "/remove-member",
  authMiddleware,
  boardController.serviceRemoveMember
);

/**
 * @swagger
 * /board/accept:
 *   post:
 *     summary: Accept invitation to join
 *     security:
 *      - BearerAuth: []
 *     tags: [Board]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invitationId
 *               - boardId
 *               - memberId
 *             properties:
 *               invitationId:
 *                 type: string
 *                 example: c644ad74ec9306788e705e8c
 *               boardId:
 *                 type: string
 *                 example: 6788e705e8cc644ad74ec930
 *               memberId:
 *                 type: string
 *                 example: 6788e705e8cc644a705e8cc64
 *     responses:
 *       401:
 *         description: Unauthorized
 */
boardRouter.put("/accept", authMiddleware, boardController.serviceAccept);

/**
 * @swagger
 * /board/{id}/delete:
 *   delete:
 *     summary: Delete board
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: [Board]
 *     responses:
 *       401:
 *         description: Unauthorized
 */
boardRouter.put("/:id/delete", authMiddleware, boardController.trashBoard);
/**
 * @swagger
 * /board:
 *   get:
 *     summary: Get board by user
 *     security:
 *      - BearerAuth: []
 *     tags: [Board]
 *     responses:
 *       401:
 *         description: Unauthorized
 */
boardRouter.get("/", authMiddleware, boardController.getBoard);
/**
 * @swagger
 * /board/{slug}:
 *   get:
 *     summary: Get board detail by user
 *     security:
 *      - BearerAuth: []
 *     tags: [Board]
 *     parameters:
 *      - name: slug
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       401:
 *         description: Unauthorized
 */
boardRouter.get("/:slug", authMiddleware, boardController.getBoardDetail);
/**
 * @swagger
 * /board:
 *   post:
 *     summary: Create board
 *     security:
 *      - BearerAuth: []
 *     tags: [Board]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *             properties:
 *               title:
 *                 type: string
 *                 example: test
 *               type:
 *                 type: string
 *                 example: public
 *     responses:
 *       401:
 *         description: Unauthorized
 */
boardRouter.post("/", authMiddleware, boardController.createBoard);
boardRouter.put("/:id", authMiddleware, boardController.updateBoard);

export default boardRouter;
