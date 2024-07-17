import { Schema, model } from "mongoose";
import BasicInfo from "./Basicinfo.model.js";
const productSchema=new Schema(
    {
        productName:{
            type:String
        },
        productDescription:{
            type:String
        },
        productPhoto:{
            public_id:{
                type:String
            },
            secure_url:{
                type:String
            }
        },
        productPrice:{
            type:Number
        },
        productDiscount:{
            type:Number
        },
        productStatus:{
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


const Products=model("PRODUCTS",productSchema)

export default Products