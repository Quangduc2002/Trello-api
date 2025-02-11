import { ObjectId } from "mongodb";
import { GET_DB } from "../config/mongodb.js";
import { slugify } from "../utils/formatters.js";
import { boardModel } from "../models/boardModel.js";
import { columnModel } from "../models/columnModel.js";
import { cardModel } from "../models/cardModel.js";
import { userModel } from "../models/userModel.js";
import { invitationModel } from "../models/invitationModel.js";
import { convertIdToObjectId } from "../utils/convertObjectId.js";
import { verifyToken, extractToken } from "../middleware/JWTAction.js";

const validateCreate = async (data) => {
  return await boardModel.BOARD_COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false,
  });
};

const getBoard = async (req, res, next) => {
  try {
    const token = extractToken(req);
    const verifytoken = verifyToken(token);

    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .find({ memberIds: new ObjectId(verifytoken?._id), _destroy: false })
      .toArray();

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const createBoard = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      slug: slugify(req.body.title || ""),
    };

    const validateData = await validateCreate(data);
    const newBoard = {
      ...validateData,
      memberIds: new ObjectId(validateData.memberIds),
    };

    const createBoard = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .insertOne(newBoard);

    if (createBoard.acknowledged) {
      res.status(200).json({
        message: "Board created successfully",
        boardId: createBoard.insertedId,
      });
    } else {
      throw new Error("Failed to insert new board");
    }
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the board",
      error: error.message,
    });
  }
};

const getBoardDetail = async (req, res, next) => {
  try {
    const token = extractToken(req);
    const verifytoken = verifyToken(token);
    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            slug: req?.params?.slug,
            _destroy: false,
            memberIds: new ObjectId(verifytoken?._id),
          },
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "columns",
          },
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME,
            localField: "memberIds",
            foreignField: "_id",
            as: "members",
          },
        },
        {
          $unwind: {
            path: "$columns",
            preserveNullAndEmptyArrays: true, // Giữ lại bảng ngay cả khi không có columns
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: "columns._id",
            foreignField: "columnId",
            as: "columns.cards", // Thêm cards vào từng column
          },
        },
        {
          $group: {
            _id: "$_id",
            slug: { $first: "$slug" },
            _destroy: { $first: "$_destroy" },
            memberIds: { $first: "$memberIds" },
            title: { $first: "$title" },
            type: { $first: "$type" },
            members: { $first: "$members" },
            columnOrderIds: { $first: "$columnOrderIds" },
            columns: { $push: "$columns" }, // Gom các columns lại thành mảng
          },
        },
        {
          $set: {
            columns: {
              $cond: {
                if: {
                  $eq: [{ $size: { $ifNull: ["$columns.title", false] } }, 0],
                },
                then: [],
                else: "$columns",
              },
            },
          },
        },
      ])
      .toArray();

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const updateBoard = async (req, res, next) => {
  try {
    const boardId = req?.params?.id;
    const updateData = {
      ...req.body,
      updatedAt: Date.now(),
    };

    if (updateData) {
      updateData.columnOrderIds = convertIdToObjectId(
        updateData?.columnOrderIds
      );
    }

    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const trashBoard = async (req, res, next) => {
  try {
    const data = {
      ...req.params,
    };

    const result = await GET_DB()
      .collection(boardModel.BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(data?.id) },
        { $set: { _destroy: true } },
        { returnDocument: "after" }
      );

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const serviceAccept = async (req, res, next) => {
  try {
    const data = {
      invitationId: req.body._id,
      boardId: req.body.boardId,
      memberId: req.body.memberId,
    };
    const [accept, result] = await Promise.all([
      GET_DB()
        .collection(invitationModel.INVITATION_COLLECTION_NAME)
        .findOneAndUpdate(
          {
            _id: new ObjectId(data?.invitationId),
          },
          {
            $set: { status: true },
          },
          { returnDocument: "after" }
        ),
      GET_DB()
        .collection(boardModel.BOARD_COLLECTION_NAME)
        .findOneAndUpdate(
          { _id: new ObjectId(data?.boardId) },
          { $addToSet: { memberIds: new ObjectId(data?.memberId) } },
          { returnDocument: "after" }
        ),
    ]);

    return res.status(200).json({ accept, result });
  } catch (error) {
    console.log(error);
  }
};

export const boardController = {
  createBoard,
  getBoard,
  getBoardDetail,
  updateBoard,
  trashBoard,
  serviceAccept,
};
