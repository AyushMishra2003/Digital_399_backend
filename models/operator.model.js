import { model, Schema } from "mongoose";

const operatorSchema=new Schema(
    {
       operatorName:{
        type:String
       },
       operatorEmail:{
        type:String,
        immutable: true
       },
       operatorPassword:{
        type:String
       },
       operatorPhoto:{
        public_id:{
            type:String,
        },
        secure_url:{
            type:String,
        }
       }    
    },
    {
        timestamps:true
    }
)

const Operator=model("OPERATOR",operatorSchema)


export default Operator