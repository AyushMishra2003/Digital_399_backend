import { response } from "express";
import SMS from "../models/SmsCustomer.model.js";
import AppError from "../utlis/error.utlis.js";
import smsSending from "../models/SmsSeding.model.js";



const registrationSms=async(req,res,next)=>{
try{
 
   const {name,phoneNumber,projectName,Quantity,domain,apiKey,apiUser}=req.body

   console.log(req.body);

   if(!name || !phoneNumber || !projectName || !Quantity  || !domain || !apiKey || !apiUser){
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
        apiKey,
        apiUser
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
        
        if(!customerId || !message ||!toWhom || !contactNumber){
            return next(new AppError("All field are Required",400))
        }
 
        const sms = await SMS.findById(customerId);

        if (!sms) {
            return next(new AppError("SMS registration not found", 400));
        }

   
        if (sms.Quantity <= 0) {
            return res.status(202).json({
                success: false,
                message: "Sms limit Reached"
            });
        }

   
        const smsData = await smsSending.create({
            customerId,
            sendingSms: {
                message,
                contactNumber
            },
            toWhom,
            response: response ? "True" : "False" 
        });

     

        smsData.response=true
        await sms.save();

        sms.Quantity = sms.Quantity - 1;
  

     
        res.status(200).json({
            success: true,
            message: "Sms Sent Successfully",
            data: smsData
        });

    } catch (error) {
     
        return next(new AppError(error.message, 500));
    }
}




export {
     registrationSms,
     getAllSmsUser,
     sendingSms
}