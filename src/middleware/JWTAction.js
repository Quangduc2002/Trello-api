import jwt from "jsonwebtoken";
import "dotenv/config";
const nonSecurePaths = ["/login", "/register"];

export const generateAccessToken = (payload) => {
  let key = process.env.ACCESS_TOKEN_SECRET;
  let accessToken = null;
  try {
    accessToken = jwt.sign(payload, key, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
    });
  } catch (error) {
    console.log(error);
  }
  return accessToken;
};

export const generateRefreshToken = (payload) => {
  let key = process.env.REFRESH_TOKEN_SECRET;
  let refreshToken = null;
  try {
    refreshToken = jwt.sign(payload, key, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN,
    });
  } catch (error) {
    console.log(error);
  }
  return refreshToken;
};

export const verifyToken = (token) => {
  let key = process.env.ACCESS_TOKEN_SECRET;
  let decoded = null;

  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

export const verifyRefreshToken = (token) => {
  let key = process.env.REFRESH_TOKEN_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

export const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

export const authMiddleware = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();

  let cookies = extractToken(req);
  if (cookies) {
    let token = cookies;
    let decoded = verifyToken(token);

    if (decoded) {
      req.token = token;
      next();
    } else {
      res.status(401).json({ message: "Chưa xác thực người dùng" });
    }
  } else {
    res.status(401).json({ message: "Chưa xác thực người dùng" });
  }
};
