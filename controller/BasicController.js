import { error } from "console";
import BasicInfo from "../models/Basicinfo.model.js";
import AppError from "../utlis/error.utlis.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

const addBasicInfo=async(req,res,next)=>{
try{

const {companyLogo,companyName,companyOwner,phoneNumber,whastappNumber,address,email_id,aboutUs,isActive,isPaid}=req.body
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
     },
     isActive,
     isPaid
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


const getAllBasicInfo=async(req,res,next)=>{
try{
   const basicInfo=await BasicInfo.find({})

   if(!basicInfo){
    return next(new AppError("Basic Info not Found",400))
   }

   res.status(200).json({
     success:true,
     message:"All Basic Info are:-",
     data:basicInfo
   })

}catch(error){
    return next(new AppError(error.message,500))
}
}

const getBasicInfo=async(req,res,next)=>{
    try{
       const {id}=req.params

       const basicInfo=await BasicInfo.findById(id)

       if(!basicInfo){
        return next(new AppError("Basic Details Not Found",400))
       }

       res.status(200).json({
         success:true,
         message:"Basic Details retervied Succesfully",
         data:basicInfo
       })

    }catch(error){
        return next(new AppError(error.message,500))
    }
}

const updateBasicInfo=async(req,res,next)=>{
try{
  const {id}=req.params

  const basicInfo=await BasicInfo.findById(id)

  if(!basicInfo){
    return next(new AppError("BasicInfo not Found",400))
  }
  

  const updatedBasicInfo=await BasicInfo.findByIdAndUpdate(
    id,
    {
        $set:req.body
    },
    {
       runValidators:true
    }
  )

  console.log(updatedBasicInfo);

  if(req.file){
    const result=await cloudinary.v2.uploader.upload(req.file.path,{
        folder:'lms'
    })
    console.log(result);
    if(result){
        updatedBasicInfo.companyLogo.public_id=result.public_id,
        updatedBasicInfo.companyLogo.secure_url=result.secure_url
    }
    fs.rm(`uploads/${req.file.filename}`)
  }


//   await updateBasicInfo.save()

  res.status(200).json({
    success:true,
    message:"Basic Info Updated Succesfully",
  })

}catch(error){
    return next(new AppError(error.message,500))
}
}

const deleteBasicInfo=async(req,res,next)=>{
  try{
  const {id}=req.params

  const basicInfo=await BasicInfo.findById(id)

  if(!basicInfo){
    return next(new AppError("BasicInformation Not Found",400))
  }

  await BasicInfo.findByIdAndDelete(id)

  res.status(200).json({
    success:true,
    message:"Basic Information Delete Succesfully"
  })
}catch(error){
  return next(new AppError(error.message,500))
}
}

const isActive=async(req,res,next)=>{
  try{
     
    const {id}=req.params

    const basicInfo=await BasicInfo.findById(id)

    console.log(basicInfo);

    if(!basicInfo){
       return next(new AppError("Basic Information Not Found",400))
    }
    
   console.log(basicInfo);
   console.log(basicInfo.isActive);

    if(basicInfo.isActive==="ACTIVE"){
        console.log("mujhse bula diya");
       basicInfo.isActive="DEACTIVE"
    }else{
         basicInfo.isActive="ACTIVE"
    }

    await basicInfo.save()

    res.status(200).json({
      success:true,
      message:"Basic information updated",
      data:basicInfo
    })
  
  }catch(error){
    return next(new AppError(error.message,500))
  }
}



export {
    addBasicInfo,
    getAllBasicInfo,
    getBasicInfo,
    updateBasicInfo,
    deleteBasicInfo,
    isActive
}