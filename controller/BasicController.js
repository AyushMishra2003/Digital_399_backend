import { error } from "console";
import BasicInfo from "../models/Basicinfo.model.js";
import AppError from "../utlis/error.utlis.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import { rmSync } from "fs";
import sendWhatsAppMessage from "../utlis/whastapp.util.js";
import CodeExpire from "../models/codeExpire.model.js";

const addBasicInfo = async (req, res, next) => {
  try {
    const {
      companyLogo,
      companyName,
      companyOwner,
      phoneNumber,
      whastappNumber,
      address,
      email_id,
      aboutUs,
      isActive,
      isPaid,
    } = req.body;

    const existingUser = await BasicInfo.findOne({ phoneNumber });

    console.log(phoneNumber.toString().length);

    if (phoneNumber.toString().length != 10) {
      return next(new AppError("Phone Number must be 10digits ", 400));
    }

    if (existingUser) {
      return next(new AppError("Phone Number already Exist"));
    }

    const existingWhastapp = await BasicInfo.findOne({ whastappNumber });

    if (existingWhastapp) {
      return next(new AppError("Whastapp Number already Exist"));
    }

    const existingEmail = await BasicInfo.findOne({ email_id });

    if (existingEmail) {
      return next(new AppError("Email id is Already Exist"));
    }

    const basicinfo = await BasicInfo.create({
      companyName,
      companyOwner,
      phoneNumber,
      whastappNumber,
      address,
      email_id,
      aboutUs,
      companyLogo: {
        public_id: "",
        secure_url: "",
      },
      isActive,
      isPaid,
    });

    const token = "uCh3Ey5i3cd7AAR4nHm2";

    console.log(basicinfo);
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      console.log(result);
      if (result) {
        (basicinfo.companyLogo.public_id = result.public_id),
          (basicinfo.companyLogo.secure_url = result.secure_url);
      }
      fs.rm(`uploads/${req.file.filename}`);
      console.log("c-4");
    }

    if (!basicinfo) {
      return next(new AppError("BasicInfo not created", 400));
    }

    await sendWhatsAppMessage(
      `${"91"}${phoneNumber}`,
      `Dear Customer Your registration is successful, with Whatsapp Number ${phoneNumber} and Email id is ${email_id} `,
      token
    );

    await basicinfo.save();

    res.status(200).json({
      success: true,
      message: "BasicInfo added",
      data: basicinfo,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getAllBasicInfo = async (req, res, next) => {
  try {
    const basicInfo = await BasicInfo.find({});

    if (!basicInfo) {
      return next(new AppError("Basic Info not Found", 400));
    }

    res.status(200).json({
      success: true,
      message: "All Basic Info are:-",
      data: basicInfo,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getBasicInfo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const basicInfo = await BasicInfo.findById(id);

    if (!basicInfo) {
      return next(new AppError("Basic Details Not Found", 400));
    }

    res.status(200).json({
      success: true,
      message: "Basic Details retervied Succesfully",
      data: basicInfo,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const updateBasicInfo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const basicInfo = await BasicInfo.findById(id);

    if (!basicInfo) {
      return next(new AppError("BasicInfo not Found", 400));
    }

    const updatedBasicInfo = await BasicInfo.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        runValidators: true,
      }
    );

    console.log(updatedBasicInfo);

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      console.log(result);
      if (result) {
        (updatedBasicInfo.companyLogo.public_id = result.public_id),
          (updatedBasicInfo.companyLogo.secure_url = result.secure_url);
      }
      fs.rm(`uploads/${req.file.filename}`);
    }

    //   await updateBasicInfo.save()

    res.status(200).json({
      success: true,
      message: "Basic Info Updated Succesfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const deleteBasicInfo = async (req, res, next) => {
  try {
    const { id } = req.params;

    const basicInfo = await BasicInfo.findById(id);

    if (!basicInfo) {
      return next(new AppError("BasicInformation Not Found", 400));
    }

    await BasicInfo.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Basic Information Delete Succesfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const isActive = async (req, res, next) => {
  try {
    const { id } = req.params;

    const basicInfo = await BasicInfo.findById(id);

    console.log(basicInfo);

    if (!basicInfo) {
      return next(new AppError("Basic Information Not Found", 400));
    }

    console.log(basicInfo);
    console.log(basicInfo.isActive);

    if (basicInfo.isActive === "ACTIVE") {
      console.log("mujhse bula diya");
      basicInfo.isActive = "DEACTIVE";
    } else {
      basicInfo.isActive = "ACTIVE";
    }

    await basicInfo.save();

    res.status(200).json({
      success: true,
      message: "Basic information updated",
      data: basicInfo,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const addCode = async (req, res, next) => {
  try {
    const verificationCode = "134556";
    const mobileNumber = 6388291292;

    const verifyCode = await CodeExpire.create({
      verificationCode,
      mobileNumber,
    });

    if (!verificationCode) {
      return next(new AppError("Not Created", 400));
    }

    await verifyCode.save();

    res.status(200).json({
      success: true,
      message: "Code Verify",
      data: verificationCode,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export {
  addBasicInfo,
  getAllBasicInfo,
  getBasicInfo,
  updateBasicInfo,
  deleteBasicInfo,
  isActive,
  addCode,
};
