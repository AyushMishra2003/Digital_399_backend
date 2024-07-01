import BasicInfo from "../models/Basicinfo.model.js";
import AppError from "../utlis/error.utlis.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

const addBasicInfo=async(req,res,next)=>{
try{

const {companyLogo,companyName,companyOwner,phoneNumber,whastappNumber,address,email_id,aboutUs}=req.body
const basicinfo=await BasicInfo.create({
     companyName,
     companyOwner,
     phoneNumber,
     whastappNumber,
     address,
     email_id,
     aboutUs,
     companyLogo:{
        public_id:"",
        secure_url:""
     }
 })
  
 console.log(basicinfo);
 if(req.file){
    const result=await cloudinary.v2.uploader.upload(req.file.path,{
        folder:'lms'
    })
    console.log(result);
    if(result){
        // basicinfo.companyLogo.public_id=result.public_id,
        basicinfo.companyLogo.secure_url=result.secure_url
    }
    fs.rm(`uploads/${req.file.filename}`)
    console.log("c-4");
}
 
 if(!basicinfo){
    return next(new AppError("BasicInfo not created",400))
 }
  
 await basicinfo.save()

 res.status(200).json({
    success:true,
    message:"BasicInfo added",
    data:basicinfo
 })

}catch(error){
    return next(new AppError(error.message,500))
}
}



export {
    addBasicInfo
}