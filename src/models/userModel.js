import Joi from "joi";
import {
  REG_EMAIL,
  REG_EMAIL_MESSAGE,
  REG_PASSWORD,
  REG_PASSWORD_MESSAGE,
} from "../utils/validators.js";

const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(5).max(50).trim().strict(),
  email: Joi.string().required().pattern(REG_EMAIL).message(REG_EMAIL_MESSAGE),
  password: Joi.string()
    .required()
    .pattern(REG_PASSWORD)
    .message(REG_PASSWORD_MESSAGE),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
};
