import { Schema, model } from "mongoose";



const feedBackSchema=new Schema(
    {
         feedBackStar:{
            type:Number
         },
         feedBackMessage:{
            type:String
         }
    },
    {
        timestamps:true
    }
)


const Feedback=model("FeedBack",feedBackSchema)




export default Feedback