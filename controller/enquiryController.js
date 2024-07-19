import Enquiry from "../models/enquiry.model.js";
import AppError from "../utlis/error.utlis.js";
import BasicInfo from "../models/Basicinfo.model.js";
import TrashInquiry from "../models/Trash_Enquiry_Model.js";

const addEnquiry = async (req, res, next) => {
  try {
    const {
      inquiryName,
      inquiryEmail,
      inquiryPhoneNumber,
      inquiryMessage,
      basicId,
    } = req.body;

    const basicInfo = await BasicInfo.findById(basicId);

    if (
      !inquiryName ||
      !inquiryEmail ||
      !inquiryPhoneNumber ||
      !inquiryMessage
    ) {
      return next(new AppError("All Field are Required", 404));
    }

    if (!basicInfo) {
      return next(new AppError("User Not Found"));
    }

    const token = req.cookies.token;
    if (token != basicInfo.token) {
      return next(new AppError("You are Not Authrized", 400));
    }

    const enquiry = await Enquiry.create({
      inquiryName,
      inquiryEmail,
      inquiryMessage,
      inquiryPhoneNumber,
      basic_info_id: basicId,
    });

    if (!enquiry) {
      return next(new AppError("Enquiry Not Found", 400));
    }

    res.status(200).json({
      success: true,
      message: "Inquiry Added Succesfully",
      data: enquiry,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getEnquiry = async (req, res, next) => {
  try {
    const { id, basicId } = req.body;

    const basicInfo = await BasicInfo.findById(basicId);

    if (!basicInfo) {
      return next(new AppError("User Not Found", 404));
    }

    const token = req.cookies.token;
    if (token != basicInfo.token) {
      return next(new AppError("You are Not Authrized", 400));
    }

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return next(new AppError("Inquiry Not Found", 404));
    }

    res.status(200).json({
      success: true,
      message: "All Enquiry are:-",
      data: enquiry,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getSingleEnquiry = async (req, res, next) => {
  try {
    const { id, basic_info_id } = req.body;

    const basicInfo = await BasicInfo.findById(basic_info_id);

    if (!basicInfo) {
      return next(new AppError("User Not Found", 404));
    }

    const token = req.cookies.token;
    if (token != basicInfo.token) {
      return next(new AppError("You are Not Authrized", 400));
    }

    const enquiry = await Enquiry.find({ basic_info_id });

    if (!enquiry) {
      return next(new AppError("Inquiry Not Found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Single Inquiry",
      data: enquiry,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const deleteEnquiry = async (req, res, next) => {
  try {
    const { id, basic_info_id } = req.body;

    console.log(req.body);

    const basicInfo = await BasicInfo.findById(basic_info_id);

    if (!basicInfo) {
      return next(new AppError("User Not Found", 404));
    }

    const token = req.cookies.token;
    if (token != basicInfo.token) {
      return next(new AppError("You are Not Authrized", 400));
    }

    const enquiry = await Enquiry.findById(id);

    if (!enquiry) {
      return next(new AppError("Enquiry not Found", 404));
    }

    const trashInquiry = await TrashInquiry.create({
      inquiryName: enquiry.inquiryName,
      inquiryEmail: enquiry.inquiryEmail,
      inquiryMessage: enquiry.inquiryMessage,
      inquiryPhoneNumber: enquiry.inquiryPhoneNumber,
      basic_info_id: enquiry.basic_info_id,
      inquiryId: enquiry._id,
    });

    console.log(trashInquiry);

    await trashInquiry.save();

    await Enquiry.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Inquiry moved to trash successfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const restoreEnquiry = async (req, res, next) => {
  try {
    const { inquiryId, basic_info_id } = req.body;
    console.log(req.body);

    console.log(req.body);

    const basicInfo = await BasicInfo.findById(basic_info_id);

    if (!basicInfo) {
      return next(new AppError("User Not Found", 404));
    }

    const token = req.cookies.token;
    if (token != basicInfo.token) {
      return next(new AppError("You are Not Authrized", 400));
    }

    const enquiry = await TrashInquiry.find({ inquiryId });

    console.log(enquiry);

    if (!enquiry) {
      return next(new AppError("Enquiry not Found", 404));
    }

    const inquiry = await Enquiry.create({
      inquiryName: enquiry.inquiryName,
      inquiryEmail: enquiry.inquiryEmail,
      inquiryMessage: enquiry.inquiryMessage,
      inquiryPhoneNumber: enquiry.inquiryPhoneNumber,
      basic_info_id: enquiry.basic_info_id,
    });

    await inquiry.save();

    await TrashInquiry.findByIdAndDelete(enquiry._id);

    res.status(200).json({
      success: true,
      message: "Inquiry Stored Succesfully",
      data: inquiry,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getTrashEnquiry = async (req, res, next) => {
  try {
    const allTrashEnquiry = await TrashInquiry.find({});

    if (!allTrashEnquiry) {
      return next(new AppError("Trash Enquiry Not Found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Deleted Enquiry Reterive Succesfully",
      data: allTrashEnquiry,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export {
  addEnquiry,
  getEnquiry,
  deleteEnquiry,
  getSingleEnquiry,
  restoreEnquiry,
  getTrashEnquiry,
};
