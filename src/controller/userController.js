import { GET_DB } from "../config/mongodb.js";
import { userModel } from "../models/userModel.js";
import { verifyToken, extractToken } from "../middleware/JWTAction.js";

const validateCreate = async (data) => {
  return await userModel.USER_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const checkUserEmail = async (userEmail) => {
  try {
    const email = await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .findOne({ email: userEmail?.trim() });

    if (email) {
      return true; // return
    } else {
      return false;
    }
  } catch (e) {
    return e;
  }
};

const createUser = async (req, res, next) => {
  try {
    const newUser = {
      ...req.body,
    };

    const validateData = await validateCreate(newUser);

    const isExist = await checkUserEmail(validateData?.email);
    if (isExist) {
      return res.status(500).json({
        message: "Email đã tồn tại",
      });
    } else {
      const createBoard = await GET_DB()
        .collection(userModel.USER_COLLECTION_NAME)
        .insertOne(validateData);

      if (createBoard.acknowledged) {
        res.status(200).json({
          message: "User created successfully",
          userId: createBoard.insertedId,
        });
      } else {
        throw new Error("Failed to insert new user");
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the user",
      error: error.message,
    });
  }
};

const getProfile = async (req, res, next) => {
  try {
    const token = extractToken(req);
    const verifytoken = verifyToken(token);

    res.status(200).json({ data: verifytoken });
  } catch (error) {
    console.log(error);
  }
};

export const userController = {
  createUser,
  getProfile,
};
