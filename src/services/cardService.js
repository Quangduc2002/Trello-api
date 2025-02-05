import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongodb.js";

export const findOneById = async (id, nameCollection) => {
  try {
    const result = await GET_DB()
      .collection(nameCollection)
      .findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.log(error);
  }
};
