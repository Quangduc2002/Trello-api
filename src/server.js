import express from "express";
import { CONNECT_DB, GET_DB } from "./config/mongodb.js";
import "dotenv/config";
import { router } from "./routes/index.js";
const PORT = process.env.PORT;
import { corsOptions } from "./config/cors.js";
import cors from "cors";

const START_SERVER = () => {
  const app = express();
  // CONNECT_DB();

  app.use(cors(corsOptions));
  app.use(express.json());
  router(app);
  if (process.env.BUILD_MODE === "production") {
    app.listen(PORT, () => {
      console.log(`${PORT}`);
    });
  } else {
    app.listen(process.env.LOCAL_DEV_PORT, () => {
      console.log(`http://localhost:${process.env.LOCAL_DEV_PORT}`);
    });
  }
};

CONNECT_DB()
  .then(() => console.log("Connected to database"))
  .then(() => START_SERVER())
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
