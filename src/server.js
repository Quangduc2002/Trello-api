// const express = require("express");
// require("dotenv").config();
// const { CONNECT_DB, GET_DB } = require("./config/mongodb");
import express from "express";
import { CONNECT_DB, GET_DB } from "./config/mongodb.js";
import "dotenv/config";
import { router } from "./routes/index.js";
const PORT = process.env.PORT || 8080;
import { corsOptions } from "./config/cors.js";
import cors from "cors";

// const START_SERVER = () => {
const app = express();
CONNECT_DB();

app.use(cors(corsOptions));
app.use(express.json());
router(app);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

app.get("/", async (req, res) => {
  console.log(await GET_DB().listCollections().toArray());

  res.send("<h1>QuangDucDev</h1>");
});
// };

// CONNECT_DB()
//   .then(() => console.log("Connected to database"))
//   .then(() => START_SERVER())
//   .catch((err) => {
//     console.error(err);
//     process.exit(0);
//   });
