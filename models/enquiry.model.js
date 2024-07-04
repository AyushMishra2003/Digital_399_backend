import { Schema, model } from "mongoose";



const enquirySchema=new Schema(
    {
        inquiryName:{
            type:String,
            required:true
        },
        inquiryEmail:{
            type:String,
            required:true
        },
        inquiryPhoneNumber:{
            type:String,
            required:true
        },
        inquiryMessage:{
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const Inquiry=model("INQUIRY",enquirySchema)

export default Inquiry