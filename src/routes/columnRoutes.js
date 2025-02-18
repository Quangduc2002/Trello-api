import express from "express";
const columnRouter = express.Router();

import { columnController } from "../controller/columnController.js";
import { authMiddleware } from "../middleware/JWTAction.js";

/**
 * @swagger
 * /column/{id}/delete:
 *   delete:
 *     summary: Delete column in board
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: [Column]
 *     responses:
 *       401:
 *         description: Unauthorized
 */
columnRouter.delete(
  "/:id/delete",
  authMiddleware,
  columnController.deleteColumn
);

columnRouter.put(
  "/move-card-column",
  authMiddleware,
  columnController.updateCardColumn
);
/**
 * @swagger
 * /column:
 *   post:
 *     summary: Add column to board
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: [Column]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *               - title
 *             properties:
 *               boardId:
 *                 type: string
 *                 example: 6788e705e8cc644ad74ec930
 *               title:
 *                 type: string
 *                 example: test
 *     responses:
 *       401:
 *         description: Unauthorized
 */
columnRouter.post("/", authMiddleware, columnController.createColumn);
columnRouter.put("/:id", authMiddleware, columnController.updateColumn);

export default columnRouter;
