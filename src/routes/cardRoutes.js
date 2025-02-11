import express from "express";
const cardRouter = express.Router();

import { cardController } from "../controller/cardController.js";
import { authMiddleware } from "../middleware/JWTAction.js";

cardRouter.put("/:id/edit", authMiddleware, cardController.updateCard);
cardRouter.delete("/:id/delete", authMiddleware, cardController.deleteCard);
cardRouter.post("/", authMiddleware, cardController.createCard);

export default cardRouter;
