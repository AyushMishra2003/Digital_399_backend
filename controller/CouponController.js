import Coupon from "../models/coupon.model.js"
import AppError from "../utlis/error.utlis.js"



const addCoupon=async(req,res,next)=>{
try{
   
    const {couponCode, discountType,discountAmount,  expiryDate,userLimit}=req.body

    if(!couponCode || !discountType || !discountAmount || !expiryDate || !userLimit){
        return next(new AppError("All field are Required",400))
    }

    const coupon=await Coupon.create({
        couponCode,
        discountType,
        discountAmount,
        expiryDate,
        userLimit
    })

    await coupon.save()

    res.status(200).json({
        success:true,
        message:"add Coupon Succesfully",
        data:coupon
    })
   
}catch(error){
    return next(new AppError(error.message,500))
}
}


const getCoupon=async(req,res,next)=>{
    try{
          const allCoupon=await Coupon.find({})

          if(!allCoupon){
            return next(new AppError("Coupon Not Found",404))
          }

          res.status(200).json({
            success:true,
            message:"All Coupon Code",
            data:allCoupon
          })

    }catch(error){
        return next(new AppError(error.message,500))  
    }
}

const applyCoupon=async(req,res,next)=>{
    try{
       const {id,couponCode,discountAmount}=req.body

       const validCoupon=await Coupon.findById(id)

       if(!validCoupon){
        return next(new AppError("Coupon is Not Valid",400))
       }

       if(validCoupon.couponCode!=couponCode){
        return next(new AppError("Coupon Code is Not Valid",404))
       }

       if(validCoupon.userLimit<=0){
        return next(new AppError("Coupon Limit is Excit",400))
       }

      validCoupon.userLimit=validCoupon.userLimit-1

      await validCoupon.save()

      res.status(200).json({
        success:true,
        message:"Coupon Apply Succesfully"
      })

    }catch(error){
        return next(new AppError(error.message,500))
    }
}

const updateCoupon=async(req,res,next)=>{
    try {
        const { id } = req.params;
    
  
        const validCoupon = await Coupon.findById(id);
    
        if (!validCoupon) {
          return next(new AppError("Coupon  Not Found", 404));
        }
    
        // Update the operator document with req.body
        const updatedCoupon = await Coupon.findByIdAndUpdate(
          id,
          { $set: req.body },
          { new: true, runValidators: true } 
        );
        

        if(!updateCoupon){
            return next(new AppError("Update Coupon is Not Updated,try again",400))
        }
    
     
        res.status(200).json({
          success: true,
          message: "Coupon Updated Successfully",
        });
    
      } catch (error) {
        return next(new AppError(error.message, 500));
      }
}


const deleteCoupon=async(req,res,next)=>{
    try{

        const {id}=req.params
    
        const validCoupon=await Coupon.findById(id)

        if(!validCoupon){
            return next(new AppError("Coupon is not Valid",400))
        }

        await Coupon.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:"Coupon Delete Succesfully"
        })

    }catch(error){
        return next(new AppError(error.message,500))
    }
}



export {
    addCoupon,
    getCoupon,
    applyCoupon,
    updateCoupon,
    deleteCoupon
}