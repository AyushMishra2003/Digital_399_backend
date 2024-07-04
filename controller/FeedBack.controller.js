import Feedback from "../models/feedback.model.js"
import AppError from "../utlis/error.utlis.js"


const addFeedBack=async(req,res,next)=>{
try{
    
    const { feedBackStar, feedBackMessage}=req.body

    console.log(req.body);

    if(!feedBackStar || !feedBackMessage){
        return next(new AppError("All details are Required",400))
    }

    const feedback=await Feedback.create({
         feedBackStar,
         feedBackMessage
    })


    if(!feedback){
        return next(new AppError("Feedback Not Send",400))
    }
    

    res.status(200).json({
        success:true,
        message:"Feedback Added Succesfully",
        data:feedback
    })


}catch(error){
    return next(new AppError(error.message,500))
}
}

const getFeedBack=async(req,res,next)=>{
  try{

    const feedback=await Feedback.find({})

    if(!feedback){
        return next(new AppError("Feedback not Found",400))
    }


    res.status(200).json({
        success:true,
        message:"Feeback Details are:-",
        data:feedback
    })

  }catch(error){
    return next(new AppError(error.message,500))
  }
}

const deleteFeedBack=async(req,res,next)=>{
try{

    const {id}=req.params

    const feedback=await Feedback.findById(id)

    if(!feedback){
        return next(new AppError("Feedback not Found",404))
    }

    res.status(200).json({
        success:true,
        message:"Feedback Delete Succesfully",
        data:feedback
    })

}catch(error){
    return next(new AppError(error.message,500))
}
}

export {
    addFeedBack,
    getFeedBack,
    deleteFeedBack
}