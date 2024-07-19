import BasicInfo from "../models/Basicinfo.model.js";
import Feedback from "../models/feedback.model.js";
import AppError from "../utlis/error.utlis.js";
import TrashFeedback from "../models/Trash_Feedback_Model.js";
import mongoose from "mongoose";

const addFeedBack = async (req, res, next) => {
  try {
    const { feedBackStar, feedBackMessage, basicId } = req.body;

    const basicInfo = await BasicInfo.findById(basicId);

    if (!feedBackStar || !feedBackMessage) {
      return next(new AppError("All details are Required", 400));
    }

    if (!basicInfo) {
      return next(new AppError("User Not Found"));
    }

    const token = req.cookies.token;
    if (token != basicInfo.token) {
      return next(new AppError("You are Not Authrized", 400));
    }

    const feedback = await Feedback.create({
      feedBackStar,
      feedBackMessage,
      basic_info_id: basicId,
    });

    if (!feedback) {
      return next(new AppError("Feedback Not Send", 400));
    }

    res.status(200).json({
      success: true,
      message: "Feedback Added Succesfully",
      data: feedback,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getFeedBack = async (req, res, next) => {
  try {
    const { basic_info_id } = req.body;

    const basicInfo = await BasicInfo.findById(basic_info_id);

    if (!basicInfo) {
      return next(new AppError("User Not Found", 404));
    }

    const token = req.cookies.token;
    if (token != basicInfo.token) {
      return next(new AppError("You are Not Authrized", 400));
    }

    const feedback = await Feedback.find({ basic_info_id });

    if (!feedback) {
      return next(new AppError("Feedback Not Found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Feedback Reterive Successfully",
      data: feedback,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const deleteFeedBack = async (req, res, next) => {
  try {
    const { basic_info_id, id } = req.body;

    const basicInfo = await BasicInfo.findById(basic_info_id);

    if (!basicInfo) {
      return next(new AppError("User Not Found", 404));
    }

    const token = req.cookies.token;
    if (token !== basicInfo.token) {
      return next(new AppError("You are Not Authorized", 400));
    }

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return next(new AppError("Feedback not Found", 404));
    }

    const trashFeedback = new TrashFeedback({
      feedBackStar: feedback.feedBackStar,
      feedBackMessage: feedback.feedBackMessage,
      basic_info_id: feedback.basic_info_id,
      feedbackId: feedback._id,
    });

    await trashFeedback.save();

    // Delete feedback from main collection
    await Feedback.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Feedback moved to trash successfully",
      data: feedback,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export { addFeedBack, getFeedBack, deleteFeedBack };
