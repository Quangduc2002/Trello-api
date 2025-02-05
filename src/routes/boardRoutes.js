import express from "express";
const boardRouter = express.Router();

import { boardController } from "../controller/boardController.js";
import { checkUserJWT } from "../middleware/JWTAction.js";

boardRouter.put("/:id/delete", checkUserJWT, boardController.trashBoard);
boardRouter.get("/", checkUserJWT, boardController.getBoard);
boardRouter.get("/:slug", checkUserJWT, boardController.getBoardDetail);
boardRouter.post("/", checkUserJWT, boardController.createBoard);
boardRouter.put("/:id", checkUserJWT, boardController.updateBoard);

export default boardRouter;
