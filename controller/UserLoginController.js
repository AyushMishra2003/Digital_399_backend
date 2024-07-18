// loginController.js

import BasicInfo from "../models/Basicinfo.model.js";
import AppError from "../utlis/error.utlis.js";
import sendSms from "../utlis/twilioService.js";




let verificationCodes = {}; // Store verification codes temporarily

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const requestLogin = async (req, res,next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).send('Phone number is required.');
  }
 
   const basicInfo=await BasicInfo.findOne({phoneNumber})

   if(!basicInfo){
     return next(new AppError("Phone Number is Not Valid",404))
   }

   console.log(basicInfo);

  const verificationCode = generateVerificationCode();
  verificationCodes[phoneNumber] = verificationCode;

  console.log(`Generated code for ${phoneNumber}: ${verificationCode}`);

  try {
    await sendSms(phoneNumber, `Your verification code is: ${verificationCode}`);
    res.status(200).json({
      success:true,
      message:"Verification code sent via SMS."
    })
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send verification code.');
  }
};

export const verifyCode = async(req, res,next) => {
  const { phoneNumber, verificationCode } = req.body;

  console.log(req.body);

  if (!phoneNumber || !verificationCode) {
     return res.status(400).json({
      success:false,
      message:"Phone number and verification code are required"
     })
  }

  const storedCode = verificationCodes[phoneNumber];

  console.log(`Stored code for ${phoneNumber}: ${storedCode}`);

  if (storedCode && storedCode === verificationCode) {
    delete verificationCodes[phoneNumber]; 
    const basicInfo=await BasicInfo.findOne({phoneNumber})
    const token = await basicInfo.generateJWTToken();


    basicInfo.token=token
    

    await basicInfo.save()

    console.log(basicInfo.token);
    console.log(basicInfo);
     res.cookie('token', token, {
      httpOnly: true,
      // secure: true, // Enable for HTTPS only
      maxAge: 3600000, // Example: cookie expires in 1 hour (in milliseconds)
      sameSite: 'strict' // Recommended to prevent CSRF
     });


    res.status(200).json({
      success:true,
      message:"Verification Succesfully"
    })
  } else {
    res.status(400).send('Invalid verification code.');
  }
}; 



export const Userlogout=(req,res)=>{

  res.cookie('token',null,{
      secure:true,
      maxAge:0,
      httpOnly:true
  })

  res.status(200).json({
      success:true,
      message:"User logged out successfully"
  })
}