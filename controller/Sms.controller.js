import { response } from "express";
import SMS from "../models/SmsCustomer.model.js";
import AppError from "../utlis/error.utlis.js";
import smsSending from "../models/SmsSeding.model.js";
import axios from 'axios'


const registrationSms=async(req,res,next)=>{
try{
 
   const {name,phoneNumber,projectName,Quantity,domain,apiUserName,apiPassword,apiKey}=req.body

   console.log(req.body);

   if(!name || !phoneNumber || !projectName || !Quantity  || !domain || !apiUserName || !apiPassword || !apiKey){
    return next(new AppError("All field are Required",400))
   }
   
   console.log(typeof phoneNumber);
   console.log(phoneNumber.length);
   if(phoneNumber.length!=10){
    return next(new AppError("Phone Number is not Valid",400))
   }

   const startDate = new Date();

   const sms=await SMS.create({
        name,
        phoneNumber,
        projectName,
        Quantity,
        startingDate:startDate,
        domain,
        apiUserName,
        apiPassword,
        apiKey
   })

   await sms.save()

   res.status(200).json({
    success:true,
    message:"Sms registration Succesfully",
    data:sms
   })

}catch(error){
    return next(new AppError(error.message,500))
}
}


const updateSmsUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateFields = req.body; 

        const updatedSmsUser = await SMS.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedSmsUser) {
            return next(new AppError("SMS user not found", 404));
        }

        res.status(200).json({
            success: true,
            message: "SMS user updated successfully",
            data: updatedSmsUser
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}


const getAllSmsUser=async(req,res,next)=>{
     try{
        
        const smsUser=await SMS.find({})
        
        if(!smsUser){
            return next(new AppError("sms user not found",400))
        }

        res.status(200).json({
            success:true,
            message:"All SMS user are:-",
            data:smsUser
        })

     }catch(error){
        return next(new AppError(error.message,500))
     }
}


const deleteSmsUser=async(req,res,next)=>{
try{

    const {id}=req.params

    const sms=await SMS.findById(id)

    if(!sms){
        return next(new AppError("SMS User not Found",404))
    }

    await SMS.findByIdAndDelete(id)

    res.status(200).json({
        success:true,
        message:"Delete Sms User Succesfully"
    })



}catch(error){
    return(error.message,500)
}
}




const sendingSms = async (req, res, next) => {
    try {
        const { customerId, message, contactNumber } = req.body;


        if (!customerId || !message  || !contactNumber) {
            return next(new AppError("All fields are required", 400));
        }

        const sms = await SMS.findById(customerId);

        if (!sms) {
            return res.status(400).json({
                success: false,
                message: "SMS Registration not found"
            });
        }

        if (sms.Quantity <= 0) {
            return res.status(202).json({
                success: false,
                message: "SMS limit reached"
            });
        }

        console.log(sms);

   
        const queryParams = new URLSearchParams();
        queryParams.append('username', sms.apiUserName);
        queryParams.append('password', sms.apiPassword);
        queryParams.append('receiver_number', contactNumber);
        queryParams.append('msgtext', message);
        queryParams.append('token', sms.apiKey);

        const apiUrl = `https://api.devindia.in/api/send/text/message/v1?${queryParams.toString()}`;

        let apiResponse;
        try {
       
            apiResponse = await axios.post(apiUrl);
        } catch (error) {
         
            const smsData = await smsSending.create({
                customerId,
                sendingSms: {
                    message,
                    contactNumber
                },
                response: "False",
                responseData: {
                    error: error.message  
                }
            });

            return res.status(400).json({
                success: false,
                message: "Failed to send SMS",
                data: smsData
            });
        }

        
        const smsData = await smsSending.create({
            customerId,
            sendingSms: {
                message,
                contactNumber
            },
            response: "True",
            responseData: apiResponse.data
        });

     
        sms.Quantity = sms.Quantity - 1;
        await sms.save();

     
        res.status(200).json({
            success: true,
            message: "SMS Sent Successfully",
            data: smsData
        });

    } catch (error) {
        console.error("Internal Error:", error.message);
        return next(new AppError(error.message, 500));
    }
}


const getAllSendingSms = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10; 

        const allSMS = await smsSending.find({})
                                      .limit(limit);

        if (allSMS.length === 0) {
            return next(new AppError("No messages found", 404));
        }

        res.status(200).json({
            success: true,
            message: "All messages retrieved successfully",
            data: allSMS
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const getAllFalseSendingSMS=async(req,res,next)=>{
    try{
        
        console.log("sms-1");
        const allfalseSms=await smsSending.find({response:"False"})
        console.log("sms-2");
        if(!allfalseSms){
            return next(new AppError("False sms not Found",404))
        }

        res.status(200).json({
            success:true,
            message:"All not Sent Message",
            data:allfalseSms
        })


    }catch(error){
        return next(new AppError(error.message,50))
    }
}







export {
     registrationSms,
     getAllSmsUser,
     sendingSms,
     getAllSendingSms,
     updateSmsUser,
     deleteSmsUser,
     getAllFalseSendingSMS
}