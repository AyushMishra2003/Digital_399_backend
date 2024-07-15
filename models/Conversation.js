import mongoose, { model, Schema } from "mongoose"

const conversationSchema=new Schema(
    {
       member:{
         type:Array
       },
    },
    {
       timestamps:true
    }
)

const Conversation=model("Conversation",conversationSchema)

export default Conversation