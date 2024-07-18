import BasicInfo from "../models/Basicinfo.model.js";
import Products from "../models/product.model.js";
import AppError from "../utlis/error.utlis.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'


const addProduct=async(req,res,next)=>{
    try{
        const {basicinfoId,productName,productDescription,productPrice,productDiscount}=req.body

        const basicInfo=await BasicInfo.findById(basicinfoId)

        if(!basicInfo){
            return next(new AppError("BasicInfo Id is not Valid",400))
        }
        const token = req.cookies.token; 
        if(token!=basicInfo.token){
          return(next(new AppError("You are Not Authrized",400)))
        }

        if(!productName || !productDescription || !productPrice || !productDiscount){
            return next(new AppError("All field are Required",400))
        }

        const product=await Products.create({
            productName,
            productDescription,
            productPrice,
            productPhoto:{
                public_id:"",
                secure_url:""
            },
            productDiscount,
            basic_info_id:basicinfoId
        })


        if(!product){
            return next(new AppError("Product Not Found",400))
        }

        if(req.file){
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms'
            })
            console.log(result);
            if(result){
                product.productPhoto.public_id=result.public_id,
                product.productPhoto.secure_url=result.secure_url
            }
            fs.rm(`uploads/${req.file.filename}`)
          }

          await product.save()

          res.status(200).json({
            success:true,
            message:"Product added Succesfully",
            data:product
          })


    }catch(error){
        return next(new AppError(error.message))
    }
}


const getProduct=async(req,res,next)=>{
 try{
    const product=await Products.find({})

    if(!product){
        throw new AppError('Not Found', 404);
    }

    res.status(200).json({
        success:true,
        message:"Product Retervice Succesfully",
        data:product
    })

 }catch(error){
    return next(new AppError(error.message,500))
 }
}

const getSingleProduct=async(req,res,next)=>{
    try{
       const {basic_info_id}=req.params
       const basicInfo=await BasicInfo.findById(basic_info_id)
  
       if(!basicInfo){
        return next("Id Not Exist",404)
       }
       const token = req.cookies.token; 
       if(token!=basicInfo.token){
         return(next(new AppError("You are Not Authrized",400)))
       }
  
       const  product=await Products.find({basic_info_id})
  
       if(!product){
        return next(new AppError("Service Not Found",400))
       }
  
   
       
       res.status(200).json({
        success:true,
        message:"Product Reterived Succesfully",
        data:product
       })
  
    }catch(error){
      return next(new AppError(error.message,500))
    }
  }
  


const editProduct=async(req,res,next)=>{
  try{

    const {basicInfoId,id}=req.body

    const validBasicInfo=await BasicInfo.findById(basicInfoId)

    if(!validBasicInfo){
      return next(new AppError("Id is Not Valid",400))
    }

    const token = req.cookies.token; 
    if(token!=validBasicInfo.token){
      return(next(new AppError("You are Not Authrized",400)))
    };


    const updateFields = req.body; 

    const updatedProduct = await Products.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedProduct ) {
        return next(new AppError("Product not found", 404));
    }


    if(req.file){
        const result=await cloudinary.v2.uploader.upload(req.file.path,{
            folder:'lms'
        })
        if(result){
            updatedProduct.productPhoto.public_id=result.public_id,
            updatedProduct.productPhoto.secure_url=result.secure_url
        }
        fs.rm(`uploads/${req.file.filename}`)
    }

    res.status(200).json({
        success: true,
        message: "Product Update successfully",
        data: updatedProduct
    });

       
  }catch(error){
     return next(new AppError(error.message,500))
  }
}


const deleteProduct=async(req,res,next)=>{
    try{
        
        const {id,basicInfoId}=req.body

        console.log(req.body);
      
      
        const validBasicInfo=await BasicInfo.findById(basicInfoId)
         
      
        if(!validBasicInfo){
          return next(new AppError("Id is Not Valid",400))
        }
      
        const token = req.cookies.token; 
        if(token!=validBasicInfo.token){
          return(next(new AppError("You are Not Authrized",400)))
        }

        const product=await Products.findById(id)

        if(!product){
            return next(new AppError("Product not Found",404))
        }

        product.productStatus=!product.productStatus

        await product.save()

        res.status(200).json({
            success:true,
            message:"Product Status Changed Succesfully"
        })

    }catch(error){
        return next(new AppError(error.message,500))
    }
}


export {
    addProduct,
    getProduct,
    editProduct,
    deleteProduct,
    getSingleProduct
}