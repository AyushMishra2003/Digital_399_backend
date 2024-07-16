import { model, Schema } from "mongoose";


const couponModel=new Schema(
    {
          couponCode:{
            type:String,
            required:true
          },
          discountType:{
            type:String,
            required:true,
            enum:["Inr","Percentage"],
            default:"Inr"
          },
          discountAmount:{
            type:Number,
            required:true,
          },
          expiryDate:{
            type:Date
          },
          userLimit:{
            type:Number,
            required:true
          }
    },
    {
        timestamps:true
    }
)


const Coupon=model("Coupon",couponModel)

export default Coupon