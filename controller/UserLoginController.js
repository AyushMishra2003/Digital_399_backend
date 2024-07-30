import BasicInfo from "../models/Basicinfo.model.js";
import CodeExpire from "../models/codeExpire.model.js";
import AppError from "../utlis/error.utlis.js";
import sendSmsMessage from "../utlis/sms.util.js";
import sendSms from "../utlis/twilioService.js";
import sendWhatsAppMessage from "../utlis/whastapp.util.js";

let verificationCodes = {}; // Store verification codes temporarily

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const requestLogin = async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send("Phone number is required.");
  }

  try {
    const basicInfo = await BasicInfo.findOne({ phoneNumber });
    if (!basicInfo) {
      return next(new AppError("Phone Number is Not Valid", 404));
    }

    const verificationCode = generateVerificationCode();
    verificationCodes[phoneNumber] = verificationCode;

    const token = "uCh3Ey5i3cd7AAR4nHm2";

    const formattedPhoneNumber = `+91${phoneNumber}`;

    // await sendWhatsAppMessage(
    //   `${"91"}${phoneNumber}`,
    //   `Dear Customer Your Login Verification code is: ${verificationCode} and expired in 5 Minutes Regard Dev India It Services`,
    //   token
    // );

    // await sendSmsMessage(`${"91"}${phoneNumber}`, verificationCode);

    await sendSms(
      formattedPhoneNumber,
      `Your Login Verification code is: ${verificationCode}`
    );

    const validCodeData = await CodeExpire.findOne({ phoneNumber });

    if (validCodeData) {
      validCodeData.verificationCode = verificationCode;
      await validCodeData.save();
    } else {
      const codeData = await CodeExpire.create({
        verificationCode,
        phoneNumber,
        expiryTime: Date.now() + 5 * 60 * 1000,
      });
      await codeData.save();
    }

    res.status(200).json({
      success: true,
      message: "Verification code sent Succesfully",
    });
  } catch (error) {
    console.error(error);
    return next(new AppError("Failed to Send Verification Code", 500));
  }
};

export const verifyCode = async (req, res, next) => {
  try {
    const { phoneNumber, verificationCode } = req.body;

    const ValidBasicInfo = await BasicInfo.findOne({ phoneNumber });

    if (!ValidBasicInfo) {
      return next(new AppError("Phone Number is Not Valid", 400));
    }

    const ValidCodeExpire = await CodeExpire.findOne({ phoneNumber });

    if (!ValidCodeExpire) {
      return next(
        new AppError("Your Code is Expired or Something Went Wrong", 400)
      );
    }

    const currentTime = Date.now();

    if (currentTime > ValidCodeExpire.expiryTime) {
      return next(new AppError("Your Code is Expired", 400));
    }

    if (verificationCode != ValidCodeExpire.verificationCode) {
      return next(new AppError("Code is Not Valid", 400));
    }

    const basicInfo = await BasicInfo.findOne({ phoneNumber });
    const token = await basicInfo.generateJWTToken();

    basicInfo.token = token;
    await basicInfo.save();

    console.log(`Generated token for ${phoneNumber}: ${token}`);

    delete verificationCodes[phoneNumber];

    await CodeExpire.findOneAndDelete({ phoneNumber });

    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // Enable for HTTPS only
      maxAge: 3600000,
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Verification successful",
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify code",
      error: error.message,
    });
  }
};

export const Userlogout = (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
