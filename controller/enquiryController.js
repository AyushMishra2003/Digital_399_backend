import Enquiry from "../models/enquiry.model.js";
import AppError from "../utlis/error.utlis.js";


const addEnquiry=async(req,res,next)=>{
    try{

        const {inquiryName,inquiryEmail,inquiryPhoneNumber, inquiryMessage}=req.body

        console.log(req.body);

        if(!inquiryName || !inquiryEmail || !inquiryPhoneNumber || !inquiryMessage){
            return next(new AppError("All Field are Required",404))
        }

        const enquiry=await Enquiry.create({
           inquiryName,
           inquiryEmail,
           inquiryMessage,
           inquiryPhoneNumber
        })

        if(!enquiry){
            return next(new AppError("Enquiry Not Found",400))
        }

        res.status(200).json({
            success:true,
            message:"Inquiry Added Succesfully",
            data:enquiry
        })

    }catch(error){
        return  next(new AppError(error.message,500))
    }
}


const getEnquiry=async(req,res,next)=>{
try{

    const enquiry=await Enquiry.find({})


    if(!enquiry){
        return next(new AppError("Enquiry Not Found",404))
    }


    res.status(200).json({
        success:true,
        message:"All Enquiry are:-",
        data:enquiry
    })

}catch(error){
    return next(new AppError(error.message,500))
}
}


const getSingleEnquiry=async(req,res,next)=>{
    try{

        const {id}=req.params

        const enquiry=await Enquiry.findById(id)

        if(!enquiry){
            return next(new AppError("Inquiry Not Found",404))
        }

        res.status(200).json({
            success:true,
            message:"Single Inquiry",
            data:enquiry
        })

    }catch(error){
        return next(new AppError(error.message,500))
    }
}


const deleteEnquiry=async(req,res,next)=>{
    try{
         const {id}=req.params
    
          const enquiry=await Enquiry.findById(id)

          if(!enquiry){
            return next(new AppError("Enquiry not Found",404))
          }

          await Enquiry.findByIdAndDelete(id)


          res.status(200).json({
            success:true,
            message:"Enquiry Delete Succesfully"
          })
        



    }catch(error){
        return next(new AppError(error.message,500))
    }
}

export {
    addEnquiry,
    getEnquiry,
    deleteEnquiry,
    getSingleEnquiry
}