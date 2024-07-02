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