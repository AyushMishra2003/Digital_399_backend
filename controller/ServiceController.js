import BasicInfo from "../models/Basicinfo.model.js";
import AppError from "../utlis/error.utlis.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'
import Service from "../models/service.model.js";


const addService=async(req,res,next)=>{
try{

  const {serviceName, aboutService,id}=req.body
  
  const basicInfo=await BasicInfo.findById(id)

  if(!basicInfo){
    return next(new AppError("BasicInfo not Found",400))
  }

  const service=await Service.create({
     serviceName,
     aboutService,
     servicePhoto:{
        public_id:"",
        secure_url:""
     },
     basic_info_id:basicInfo._id
  })

  if(req.file){
    const result=await cloudinary.v2.uploader.upload(req.file.path,{
        folder:'lms'
    })
    console.log(result);
    if(result){
        service.servicePhoto.public_id=result.public_id,
        service.servicePhoto.secure_url=result.secure_url
    }
    fs.rm(`uploads/${req.file.filename}`)
    console.log("c-4");
  }

  await service.save()

  res.status(200).json({
    success:true,
    message:"Service Added successfully",
    data:service
  })



}catch(error){
    return next(new AppError())
}
}

const getAllService=async(req,res,next)=>{
 try{


  const service=await Service.find({})

  if(!service){
    return next(new AppError("Service Not Found",400))
  }

  res.status(200).json({
     success:true,
     message:"All Service are:-",
     data:service
  })

 }catch(error){
  return next(new AppError(error.message,500))
 }
}

const getService=async(req,res,next)=>{
  try{
     const {id}=req.params
     
     const service=await Service.findById(id)

     if(!service){
      return next(new AppError("Service Not Found",400))
     }
     
     res.status(200).json({
      success:true,
      message:"Service Reterived Succesfully",
      data:service
     })

  }catch(error){
    return next(new AppError(error.message,500))
  }
}


const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    console.log(updateFields);

    const updatedService = await Service.findByIdAndUpdate(id, updateFields, { new: true });


    if (!updatedService) {
      return next(new AppError("Service not found", 404));
    }

    console.log("updated Service", updatedService);


    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms'
      });

      console.log(result);
      
      if (result) {
        updatedService.servicePhoto.public_id = result.public_id;
        updatedService.servicePhoto.secure_url = result.secure_url;
      }
      fs.rm(`uploads/${req.file.filename}`)
    }


    await updatedService.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
}


const deleteService=async(req,res,next)=>{
try{

  const {id}=req.params

  const service=await Service.findById(id)

  if(!service){
    return next(new AppError("Service Not Found",404))
  }

  service.serviceStatus=!service.serviceStatus


  await service.save()

  res.status(200).json({
    success:true,
    message:"Service Status Update Succesfully"
  })

}catch(error){
  return next(new AppError(error.message,500))
}
}


export {
    addService,
    getAllService,
    getService,
    updateService, 
    deleteService
}