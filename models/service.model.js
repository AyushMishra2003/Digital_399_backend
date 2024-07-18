import { Schema, model } from "mongoose";
import BasicInfo from "./Basicinfo.model.js";
const serviceSchema=new Schema(
    {
        serviceName:{
            type:String
        },
        aboutService:{
            type:String
        },
        servicePhoto:{
            public_id:{
                type:String
            },
            secure_url:{
                type:String
            }
        },
        serviceStatus:{
          type:Number,
          enum:[0,1],
          default:1

        },
        basic_info_id: { 
            type: Schema.Types.ObjectId,
            ref: 'BasicInfo'   
        }
    },
    {
        timestamps:true
    }
)

const Service=model("Service",serviceSchema)

export default Service