import { ObjectId } from "mongodb";
import { verifyToken, extractToken } from "../middleware/JWTAction.js";
import { userModel } from "../models/userModel.js";
import { invitationModel } from "../models/invitationModel.js";
import { GET_DB } from "../config/mongodb.js";
import { boardModel } from "../models/boardModel.js";

const validateCreate = async (data) => {
  return await invitationModel.INVITATION_COLLECTION_SCHEMA.validateAsync(
    data,
    {
      abortEarly: false,
    }
  );
};

const checkUserEmail = async (userEmail) => {
  try {
    const email = await GET_DB()
      .collection(userModel.USER_COLLECTION_NAME)
      .findOne({ email: userEmail?.trim() });

    if (email) {
      return email;
    } else {
      return false;
    }
  } catch (e) {
    return e;
  }
};

const checkInvitation = async (boardId, memberId) => {
  try {
    const invitation = await GET_DB()
      .collection(invitationModel.INVITATION_COLLECTION_NAME)
      .findOne({ boardId, memberId, status: false });

    if (invitation) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return e;
  }
};

const serviceInvation = async (req, res, next) => {
  try {
    const dataInvation = {
      ...req.body,
    };
    const isCheckEmail = await checkUserEmail(dataInvation?.email);
    const token = extractToken(req);
    const dataVerifyToken = verifyToken(token);

    if (isCheckEmail) {
      if (dataInvation?.email?.trim() !== dataVerifyToken?.email?.trim()) {
        const data = {
          boardId: req?.params?.id,
          memberId: isCheckEmail?._id.toString(),
        };
        const validateData = await validateCreate(data);
        const newInvitation = {
          ...validateData,
          memberId: new ObjectId(isCheckEmail?._id),
          boardId: new ObjectId(req?.params?.id),
        };
        const isExist = await checkInvitation(
          newInvitation?.boardId,
          newInvitation?.memberId
        );

        if (isExist) {
          return res.status(500).json({
            message: "Thành viên này đã được gửi lời mời.",
          });
        } else {
          const result = await GET_DB()
            .collection(invitationModel.INVITATION_COLLECTION_NAME)
            .insertOne(newInvitation);
          return res.status(200).json(result);
        }
      } else {
        return res
          .status(500)
          .json({ message: "Email không được trùng với email bạn đang mời." });
      }
    } else {
      return res
        .status(500)
        .json({ message: "Email không tồn tại trên hệ thống." });
    }
  } catch (error) {
    console.log(error);
  }
};

const serviceNotification = async (req, res, next) => {
  try {
    const token = extractToken(req);
    const dataVerifyToken = verifyToken(token);
    const result = await GET_DB()
      .collection(invitationModel.INVITATION_COLLECTION_NAME)
      // .find({ memberId: new ObjectId(dataVerifyToken?._id), status: false })
      .aggregate([
        {
          $match: {
            memberId: new ObjectId(dataVerifyToken?._id),
            status: false,
          },
        },
        {
          $lookup: {
            from: boardModel.BOARD_COLLECTION_NAME,
            localField: "boardId",
            foreignField: "_id",
            as: "board",
          },
        },
        // chuyển array thành object
        {
          $unwind: {
            path: "$board",
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .toArray();

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const serviceDeleteNotification = async (req, res, next) => {
  try {
    const data = {
      ...req.params,
    };

    const deleteNotification = GET_DB()
      .collection(invitationModel.INVITATION_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(data?.id) });

    res.status(200).json(deleteNotification);
  } catch (error) {
    console.log(error);
  }
};

export const invitationController = {
  serviceInvation,
  serviceNotification,
  serviceDeleteNotification,
};
