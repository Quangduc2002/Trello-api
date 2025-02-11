import express from "express";
const invitationRouter = express.Router();
import { authMiddleware } from "../middleware/JWTAction.js";
import { invitationController } from "../controller/invitationController.js";

invitationRouter.delete(
  "/:id",
  authMiddleware,
  invitationController.serviceDeleteNotification
);
invitationRouter.post(
  "/:id",
  authMiddleware,
  invitationController.serviceInvation
);
invitationRouter.get(
  "/",
  authMiddleware,
  invitationController.serviceNotification
);

export default invitationRouter;
