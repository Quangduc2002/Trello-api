import { columnModel } from "../models/columnModel.js";
import { pushColumnOrderId } from "../services/boardService.js";
import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongodb.js";
import { findOneById } from "../services/cardService.js";
import { convertIdToObjectId } from "../utils/convertObjectId.js";
import { cardModel } from "../models/cardModel.js";
import { boardModel } from "../models/boardModel.js";

const validateCreate = async (data) => {
  return await columnModel.COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

export const createColumn = async (req, res, next) => {
  try {
    const data = {
      boardId: req.body.boardId,
      title: req.body.title,
    };

    const validateData = await validateCreate(data);

    const newColumn = {
      ...validateData,
      boardId: new ObjectId(validateData.boardId),
    };

    const createColumn = await GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .insertOne(newColumn);

    const getNewColumn = await findOneById(
      createColumn.insertedId,
      columnModel.COLUMN_COLLECTION_NAME
    );

    if (getNewColumn) {
      await pushColumnOrderId(getNewColumn);
    }
    res.status(200).json(getNewColumn);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the column",
      error: error.message,
    });
  }
};

export const updateColumn = async (req, res, next) => {
  try {
    const columnId = req?.params?.id;
    const updateData = {
      ...req.body,
      updatedAt: Date.now(),
    };

    if (updateData) {
      updateData.cardOrderIds = convertIdToObjectId(updateData?.cardOrderIds);
    }

    const result = await GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(columnId) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateCardColumn = async (req, res, next) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: Date.now(),
    };

    if (updateData) {
      updateData.prevCardOrderIds = convertIdToObjectId(
        updateData.prevCardOrderIds
      );
      updateData.nextCardOrderIds = convertIdToObjectId(
        updateData.nextCardOrderIds
      );
    }

    const operations = [
      await GET_DB()
        .collection(columnModel.COLUMN_COLLECTION_NAME)
        .findOneAndUpdate(
          {
            _id: new ObjectId(updateData.prevColumnId),
          },
          { $set: { cardOrderIds: updateData.prevCardOrderIds } },
          { returnDocument: "after" }
        ),

      await GET_DB()
        .collection(columnModel.COLUMN_COLLECTION_NAME)
        .findOneAndUpdate(
          {
            _id: new ObjectId(updateData.nextColumnId),
          },
          { $set: { cardOrderIds: updateData.nextCardOrderIds } },
          { returnDocument: "after" }
        ),

      await GET_DB()
        .collection(cardModel.CARD_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(updateData.currentCardId) },
          { $set: { columnId: new ObjectId(updateData.nextColumnId) } },
          { returnDocument: "after" }
        ),
    ];

    await Promise.all(operations)
      .then(() => {
        res.status(200).json("success");
      })
      .catch((error) => console.log(`Error in promises ${error}`));
  } catch (error) {
    console.log(error);
  }
};

const deleteColumn = async (req, res, next) => {
  try {
    const deleteData = {
      id: req.params.id,
      ...req.body,
    };

    const deleteColumn = GET_DB()
      .collection(columnModel.COLUMN_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(deleteData.id) });

    const deleteCard = GET_DB()
      .collection(cardModel.CARD_COLLECTION_NAME)
      .deleteMany({ columnId: new ObjectId(deleteData.id) });

    const deleteColumnOrderIds = GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(deleteData.boardId) },
        { $pull: { columnOrderIds: new ObjectId(deleteData.id) } },
        { returnDocument: "after" }
      );

    await Promise.all([deleteColumn, deleteCard, deleteColumnOrderIds])
      .then(() => {
        res.status(200).json("success");
      })
      .catch((error) => console.log(`Error in promises ${error}`));
  } catch (error) {
    console.log(error);
  }
};

export const columnController = {
  createColumn,
  updateColumn,
  updateCardColumn,
  deleteColumn,
};
