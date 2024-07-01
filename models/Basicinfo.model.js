import { Schema, model } from "mongoose";

const BasicSchema=new Schema(
    {
        companyLogo:{
            public_id:{
                type:String,
            },
            secure_url:{
                type:String,
            }
        },
        companyName:{
            type:String,
            default:""
        },
        companyOwner:{
            type:String,
            default:""
        },
        phoneNumber:{
            type:Array,
            default:[]
        },
        whastappNumber:{
            type:Array,
            default:[]
        },
        address:{
            type:Array,
            default:[]
        },
        email_id:{
            type:Array,
            default:[]
        },
        aboutUs:{
            type:String,
            default:""
       }        
    },
    {
        timestamps:true
    }
)


const BasicInfo=model('BASICINFOCOMPANY',BasicSchema)

export default BasicInfo