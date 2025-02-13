import express from "express";
const columnRouter = express.Router();

import { columnController } from "../controller/columnController.js";
import { authMiddleware } from "../middleware/JWTAction.js";

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
columnRouter.post("/", authMiddleware, columnController.createColumn);
columnRouter.put("/:id", authMiddleware, columnController.updateColumn);

export default columnRouter;
