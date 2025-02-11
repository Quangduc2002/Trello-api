import boardRouter from "./boardRoutes.js";
import cardRouter from "./cardRoutes.js";
import columnRouter from "./columnRoutes.js";
import userRouter from "./userRoutes.js";
import authRouter from "./authRoutes.js";
import invitationRouter from "./invitationRoutes.js";

export const router = (app) => {
  app.use("/board", boardRouter);
  app.use("/card", cardRouter);
  app.use("/column", columnRouter);
  app.use("/user", userRouter);
  app.use("/auth", authRouter);
  app.use("/invitation", invitationRouter);
};
