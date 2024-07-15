import { model, Schema } from "mongoose";


const messageSchema=new Schema(
    {
      conversationId:{
         type:String
      },
      senderId:{
        type:String
      },
      text:{
        type:String
      }
    },
    {
        timestamps:true
    }
)


const Message=model("Message",messageSchema)

export default Message