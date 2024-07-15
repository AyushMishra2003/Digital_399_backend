import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
import AppError from '../utlis/error.utlis.js'
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
const sendMessage=async(req,res,next)=>{
try{
    
    const {senderId,receiverId}=req.body

    const member=[senderId,receiverId]

    const newConversation=await Conversation.create({
        member,
    })

    if(!newConversation){
        return next(new AppError("conversation not created"))
    }

    res.status(200).json({
        success:true,
        message:"New Conversation are",
        data: newConversation
    })

}catch(error){
    return next(new AppError(error.message,500))
}
}

const getMessage=async(req,res,next)=>{
    const {id}=req.params

    console.log(id);
    
    const conversation=await Conversation.findById(id)

    if(!conversation){
        return next(new AppError("Convesation Not Found",400))
    }

    res.status(200).json({
        success:true,
        message:"Conversation are:-",
        data:conversation
    })

}

const sendCovMessage=async(req,res,next)=>{
 try{
   const {conversationId,senderId,message}=req.body
   

   console.log(req.body);
   
   const conversation=await Conversation.findById(conversationId)

   if(!conversation){
    return next(new AppError("Conversation Not Found",400))
   }
  
   const newMessage=await Message.create({
      conversationId,
      senderId,
      message
   })

   res.status(200).json({
    success:true,
    message:"Conversation Are:-",
    data:newMessage
   })


 }catch(error){
    return next(new AppError(error.message,500))
 }
}


const getCovMessage=async(req,res,next)=>{
    try{
        
       console.log(req.params);

      const {conversationId}=req.params


      console.log("id is",conversationId);

      const messages = await Message.find({ conversationId });

      console.log(messages);

      if(!messages){
          return next(new AppError("Message Not Found",400))
      }

      res.status(200).json({
        success:true,
        message:"Message are",
        data:messages
      })

    }catch(error){
        return next(new AppError(error.message,500))
      }
}


export {
    sendMessage,
    getMessage,
    sendCovMessage,
    getCovMessage
}