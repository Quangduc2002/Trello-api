import express from "express";
const boardRouter = express.Router();

import { boardController } from "../controller/boardController.js";
import { authMiddleware } from "../middleware/JWTAction.js";

boardRouter.put("/accept", authMiddleware, boardController.serviceAccept);
boardRouter.put("/:id/delete", authMiddleware, boardController.trashBoard);
boardRouter.get("/", authMiddleware, boardController.getBoard);
boardRouter.get("/:slug", authMiddleware, boardController.getBoardDetail);
boardRouter.post("/", authMiddleware, boardController.createBoard);
boardRouter.put("/:id", authMiddleware, boardController.updateBoard);

export default boardRouter;
