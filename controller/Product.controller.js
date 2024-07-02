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
            return next(new AppError("Not Found",400))
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



export {
    addProduct,
    getProduct
}