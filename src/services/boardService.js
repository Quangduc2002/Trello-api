import { ObjectId, ReturnDocument } from "mongodb";
import { GET_DB } from "../config/mongodb.js";
import { boardModel } from "../models/boardModel.js";

export const pushColumnOrderId = async (column) => {
  try {
    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(column.boardId) },
        {
          $push: {
            columnOrderIds: new ObjectId(column._id),
          },
        },
        { ReturnDocument: "after" }
      );
    return result;
  } catch (error) {
    console.log(error);
  }
};
