import { response } from "express";
import SMS from "../models/SmsCustomer.model.js";
import AppError from "../utlis/error.utlis.js";



const registrationSms=async(req,res,next)=>{
try{
 
   const {name,phoneNumber,projectName,Quantity,startingDate,domain,apiKey,apiUser}=req.body

   if(!name || !phoneNumber || !projectName || !Quantity || !startingDate || !domain || !apiKey || !apiUser){
    return next(new AppError("All field are Required",400))
   }

   const sms=await SMS.create({
        name,
        phoneNumber,
        projectName,
        Quantity,
        startingDate,
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
      const { id } = req.params;
      const { customerId, message, toWhom, contactNumber,response } = req.body;
  

      const sms = await SMS.findById(id);
  
      if (!sms) {
        return next(new AppError("SMS registration not found", 400));
      }
     
      if(sms.Quantity<=194){
         res.status(202).json({
            success:false,
            message:"Sms limit Reached"
         })
      }


      const smsSentSuccessfully = true;

   
      const smsData = {
        customerId,
        sendingSms: {
          message,
          contactNumber
        },
        toWhom,
        response: smsSentSuccessfully ? "True" : "False"
      };
  
  
  
      sms.sms.push(smsData);
  
   
      sms.Quantity = sms.Quantity - 1;
      console.log(sms.sms.response);
      sms.sms.response = "True";
     
      console.log(sms.sms);
   
      await sms.save();
  
      res.status(200).json({
        success: true,
        message: "Sending message successfully",
        data: smsData 
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  };




export {
     registrationSms,
     getAllSmsUser,
     sendingSms
}