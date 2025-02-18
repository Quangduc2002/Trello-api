import express from "express";
const cardRouter = express.Router();

import { cardController } from "../controller/cardController.js";
import { authMiddleware } from "../middleware/JWTAction.js";

/**
 * @swagger
 * /card/{id}/edit:
 *   put:
 *     summary: Edit card in the board
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: [Card]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: test
 *     responses:
 *       401:
 *         description: Unauthorized
 */
cardRouter.put("/:id/edit", authMiddleware, cardController.updateCard);

/**
 * @swagger
 * /card/{id}/delete:
 *   delete:
 *     summary: Delete card in board
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        schema:
 *          type: string
 *     tags: [Card]
 *     responses:
 *       401:
 *         description: Unauthorized
 */
cardRouter.delete("/:id/delete", authMiddleware, cardController.deleteCard);

/**
 * @swagger
 * /card:
 *   post:
 *     summary: Add card to board
 *     security:
 *      - BearerAuth: []
 *     tags: [Card]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *               - columnId
 *               - title
 *             properties:
 *               boardId:
 *                 type: string
 *                 example: "6788e705e8cc644ad74ec930"
 *               columnId:
 *                 type: string
 *                 example: "678f1a2b65e2c4c12b94507f"
 *               title:
 *                 type: string
 *                 example: test
 *     responses:
 *       401:
 *         description: Unauthorized
 */
cardRouter.post("/", authMiddleware, cardController.createCard);

export default cardRouter;
