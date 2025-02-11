import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongodb.js";
import { cardModel } from "../models/cardModel.js";
import { columnModel } from "../models/columnModel.js";
import { findOneById } from "../services/cardService.js";
import { pushCardOrderId } from "../services/columnService.js";

const validateCreate = async (data) => {
  return await cardModel.CARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const createCard = async (req, res, next) => {
  try {
    const data = {
      boardId: req.body.boardId,
      columnId: req.body.columnId,
      title: req.body.title,
    };

    const validateData = await validateCreate(data);

    const newCard = {
      ...validateData,
      boardId: new ObjectId(validateData.boardId),
      columnId: new ObjectId(validateData.columnId),
    };

    const createCard = await GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .insertOne(newCard);

    const getNewCard = await findOneById(
      createCard.insertedId,
      cardModel.CARD_COLLECTION_NAME
    );

    if (getNewCard) {
      await pushCardOrderId(getNewCard);
    }
    res.status(200).json(getNewCard);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the card",
      error: error.message,
    });
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const deleteData = {
      id: req.params.id,
      ...req.body,
    };

    const deleteCard = GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(deleteData?.id) });

    const deleteCardOrderIds = GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(deleteData.columnId) },
        { $pull: { cardOrderIds: new ObjectId(deleteData.id) } },
        { returnDocument: "after" }
      );

    await Promise.all([deleteCard, deleteCardOrderIds])
      .then(() => {
        res.status(200).json("success");
      })
      .catch((error) => console.log(`Error in promises ${error}`));
  } catch (error) {
    console.log(error);
  }
};

const updateCard = async (req, res, next) => {
  try {
    const editCard = {
      ...req.body,
    };

    const updateCard = await GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: editCard },
        { returnDocument: "after" }
      );

    res.status(200).json(updateCard);
  } catch (error) {
    console.log(error);
  }
};

export const cardController = { createCard, deleteCard, updateCard };
