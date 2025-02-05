import { StatusCodes } from "http-status-codes";
import { WHITELIST_DOMAINS } from "../utils/constants.js";
import "dotenv/config";

export const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,
    // Thông thường khi sử dụng postman thì cái origin sẽ có giá trị là undefined
    if (process.env.BUILD_MODE === "dev") {
      return callback(null, true);
    }

    // Kiểm tra xem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(
        `${StatusCodes.FORBIDDEN} ${origin} not allowed by our CORS Policy.`
      )
    );
  },

  optionsSuccessStatus: 200,
  credentials: true,
};
