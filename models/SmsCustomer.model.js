import { Schema, model } from "mongoose";

const smsSchema=new Schema(
    {
         name:{
            type:String,
            default:"",
         },
         phoneNumber:{
            type:String,
            default:""
         },
         projectName:{
            type:String,
            default:""
         },
         Quantity:{
            type:Number,
            default:0
         },
         startingDate:{
            type:Date
         },
         domain:{
            type:String
         },
         apiKey:{
            type:Number,
            unique:true
         },
         apiUser:{
            type:String,
            unique:true
         },
    },
    {
        timestamps:true
    }
)


const SMS=model("SMSCHMEA",smsSchema)


export default SMS