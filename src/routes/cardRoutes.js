import express from "express";
const cardRouter = express.Router();

import { cardController } from "../controller/cardController.js";
import { checkUserJWT } from "../middleware/JWTAction.js";

cardRouter.put("/:id/edit", checkUserJWT, cardController.updateCard);
cardRouter.delete("/:id/delete", checkUserJWT, cardController.deleteCard);
cardRouter.post("/", checkUserJWT, cardController.createCard);

export default cardRouter;
