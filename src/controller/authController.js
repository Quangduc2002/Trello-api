import { GET_DB } from "../config/mongodb.js";
import { userModel } from "../models/userModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../middleware/JWTAction.js";

const chekUserEmail = async (userEmail) => {
  try {
    const email = await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .findOne({ email: userEmail });

    if (email) {
      return true; // return
    } else {
      return false;
    }
  } catch (e) {
    return e;
  }
};

const login = async (req, res, next) => {
  try {
    const dataUser = {
      ...req.body,
    };

    const isExist = await chekUserEmail(dataUser?.email);

    if (isExist) {
      const user = await GET_DB()
        .collection(userModel.USER_COLLECTION_NAME)
        .findOne({
          email: dataUser?.email,
          password: dataUser?.password?.trim(),
        });

      if (user) {
        let payload = {
          _id: user._id,
          email: user.email,
          name: user.name,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        res.cookie("jwt", accessToken, { httpOnly: true });
        res
          .status(200)
          .json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        return res.status(500).json({
          message: "Tài khoản hoặc mật khẩu không chính xác",
        });
      }
    } else {
      return res.status(500).json({
        message: "Tài khoản hoặc mật khẩu không chính xác",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
    };

    if (!data?.refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const verifyToken = verifyRefreshToken(data.refreshToken);
    if (verifyToken) {
      let payload = {
        _id: verifyToken._id,
        email: verifyToken.email,
        name: verifyToken.name,
      };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      res.cookie("jwt", accessToken, { httpOnly: true });
      res.json({ accessToken, refreshToken });
    } else {
      return res.status(403).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");
    return res.status(200).json("clear cookie done");
  } catch (error) {
    console.log(error);
  }
};

export const authController = {
  login,
  refreshToken,
  logout,
};
