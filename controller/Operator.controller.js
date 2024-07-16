import Operator from "../models/operator.model.js"
import AppError from "../utlis/error.utlis.js"
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

const addOperator=async(req,res,next)=>{
try{
 
    const {operatorName,operatorEmail,operatorPassword}=req.body
    
    console.log(req.body);

    if(!operatorName || !operatorEmail || !operatorPassword){
        return next(new AppError("All field are Required",400))
    }

    const operator=await Operator.create({
        operatorName,
        operatorEmail,
        operatorPassword
    })

    console.log(req.file);

    if(req.file){
      console.log("hello");
        const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms'
        })
        console.log(result);
        if(result){
            operator.operatorPhoto.public_id=result.public_id,
            operator.operatorPhoto.secure_url=result.secure_url
        }
        fs.rm(`uploads/${req.file.filename}`)
    }




    if(!operator){
        return next(new AppError("Operator Not  Created",400))
    }

    await operator.save()
    
    res.status(200).json({
        success:true,
        message:"Operator Added Succesfully",
        data:operator
    })

    


}catch(error){
    return next(new AppError(error.message,500))
}
}

const getOperator=async(req,res,next)=>{
    try{
      
        const operatorList=await Operator.find({})

        if(!operatorList){
            return next(new AppError("Operator List not Found",400))
        }

        res.status(200).json({
            success:true,
            message:"Operator List",
            data:operatorList
        })
   

    }catch(error){
        return next(new AppError(error.message,500))
    }
}


const updateOperator = async (req, res, next) => {
    try {
      const { id } = req.params;
  

      const operator = await Operator.findById(id);
  
      if (!operator) {
        return next(new AppError("Operator Not Found", 400));
      }
  
      // Update the operator document with req.body
      const updatedOperator = await Operator.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true } // Add { new: true } to return the updated document
      );
  
      // Upload operator photo to Cloudinary if req.file exists
      if (req.file) {
        console.log("hello");
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: 'lms'
        });
  
        console.log(result);
  
        // Update operatorPhoto fields in updatedOperator
        if (result) {
          updatedOperator.operatorPhoto = {
            public_id: result.public_id,
            secure_url: result.secure_url
          };
        }
  
        // Remove uploaded file from local storage
        fs.rmSync(req.file.path); // Use fs.rmSync to remove file synchronously
      }
  
      // Save updatedOperator
      await updatedOperator.save();
  
      // Respond with success message and updated data
      res.status(200).json({
        success: true,
        message: "Operator Updated Successfully",
        data: updatedOperator
      });
  
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
};

const updateStatus=async(req,res,next)=>{
  try{

    const {id}=req.params

    const operator=await Operator.findById(id)
    
    if(!operator){
      return next(new AppError("Operator Not Found",400))
    }

    operator.operatorStatus=!operator.operatorStatus

    await operator.save()

    res.status(200).json({
      success:true,
      message:"Operator List Updated",
      data:operator
    })


  }catch(error){
    return next(new AppError(error.message, 500));
  }
}
  
    


export {
    addOperator,
    getOperator,
    updateOperator,
    updateStatus,
    
}