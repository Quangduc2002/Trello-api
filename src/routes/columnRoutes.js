import express from "express";
const columnRouter = express.Router();

import { columnController } from "../controller/columnController.js";
import { checkUserJWT } from "../middleware/JWTAction.js";

columnRouter.delete("/:id/delete", checkUserJWT, columnController.deleteColumn);
columnRouter.put("/move-card-column", columnController.updateCardColumn);
columnRouter.post("/", checkUserJWT, columnController.createColumn);
columnRouter.put("/:id", checkUserJWT, columnController.updateColumn);

export default columnRouter;
