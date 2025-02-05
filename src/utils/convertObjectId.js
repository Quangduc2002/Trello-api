import { ObjectId } from "mongodb";

export const convertIdToObjectId = (cardOrderIds) => {
  if (!cardOrderIds) return null;
  return cardOrderIds
    .filter((id) => !id.includes("-placeholder-card"))
    .map((id) => new ObjectId(id));
};
