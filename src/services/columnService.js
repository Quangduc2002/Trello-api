import { ObjectId, ReturnDocument } from "mongodb";
import { GET_DB } from "../config/mongodb.js";
import { columnModel } from "../models/columnModel.js";

export const pushCardOrderId = async (card) => {
  try {
    const result = await GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(card.columnId) },
        {
          $push: {
            cardOrderIds: new ObjectId(card._id),
          },
        },
        { ReturnDocument: "after" }
      );
    return result;
  } catch (error) {
    console.log(error);
  }
};
