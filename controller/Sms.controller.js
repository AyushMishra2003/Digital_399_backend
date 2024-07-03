import { response } from "express";
import SMS from "../models/SmsCustomer.model.js";
import AppError from "../utlis/error.utlis.js";
import smsSending from "../models/SmsSeding.model.js";
import axios from 'axios'


const registrationSms=async(req,res,next)=>{
try{
 
   const {name,phoneNumber,projectName,Quantity,domain,userName,password,token}=req.body

   console.log(req.body);

   if(!name || !phoneNumber || !projectName || !Quantity  || !domain || !userName || !password || !token){
    return next(new AppError("All field are Required",400))
   }

   const startDate = new Date();

   const sms=await SMS.create({
        name,
        phoneNumber,
        projectName,
        Quantity,
        startingDate:startDate,
        domain,
        userName,
        password,
        token
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

const sendingSms = async (req, res, next) => {
    try {
        const { customerId, message, toWhom, contactNumber } = req.body;


        if (!customerId || !message || !toWhom || !contactNumber) {
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

   
        const queryParams = new URLSearchParams();
        queryParams.append('username', sms.userName);
        queryParams.append('password', sms.password);
        queryParams.append('receiver_number', contactNumber);
        queryParams.append('msgtext', message);
        queryParams.append('token', sms.token);

        const apiUrl = `https://api.devindia.in/api/send/text/message/v1?${queryParams.toString()}`;

        let apiResponse;
        try {
       
            apiResponse = await axios.post(apiUrl);
        } catch (error) {
         
            console.error("API Error:", error.message);
            const smsData = await smsSending.create({
                customerId,
                sendingSms: {
                    message,
                    contactNumber
                },
                toWhom,
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
            toWhom,
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





export {
     registrationSms,
     getAllSmsUser,
     sendingSms
}