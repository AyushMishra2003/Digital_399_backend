import BasicInfo from "../models/Basicinfo.model.js";
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
    console.log(basicInfo);
    if (!basicInfo) {
      return next(new AppError("Phone Number is Not Valid", 404));
    }

    console.log(basicInfo);

    const verificationCode = generateVerificationCode();
    verificationCodes[phoneNumber] = verificationCode;

    console.log(`Generated code for ${phoneNumber}: ${verificationCode}`);

    const token = "uCh3Ey5i3cd7AAR4nHm2";

    await sendWhatsAppMessage(
      phoneNumber,
      `Dear Customer Your Login Verification code is: ${verificationCode} Regard Dev India It Services`,
      token
    );

    await sendSmsMessage(phoneNumber, verificationCode);

    res.status(200).json({
      success: true,
      message: "Verification code sent via WhatsApp",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send verification code.");
  }
};

export const verifyCode = async (req, res, next) => {
  const { phoneNumber, verificationCode } = req.body;

  try {
    const storedCode = verificationCodes[phoneNumber];

    if (!storedCode || storedCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    const basicInfo = await BasicInfo.findOne({ phoneNumber });
    const token = await basicInfo.generateJWTToken();

    basicInfo.token = token;
    await basicInfo.save();

    console.log(`Generated token for ${phoneNumber}: ${token}`);

    delete verificationCodes[phoneNumber];

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
