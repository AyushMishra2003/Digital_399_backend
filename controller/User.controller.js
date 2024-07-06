import User from '../models/User.model.js'
import AppError from '../utlis/error.utlis.js'


const cokkieOption={ 
    secure:process.env.NODE_ENV==='production'?true:false,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
}


const register=async(req,res,next)=>{
    const {userName,password}=req.body
    if(!userName ||  !password){
        return next(new AppError('All fields are required',400))
    }
    const userExists=await User.findOne({userName})
    
    if(userExists){
       return next(new AppError('User Name already exit',400))
    }

    const user=await User.create({
        userName,
        password
    })
    if(!user){
        return next(new AppError('User registraction failed',400))
    }


    await user.save()
    
    user.password=undefined

    const token=await user.generateJWTToken()

    console.log(token);

    res.cookie('token',token,cokkieOption)

    res.status(200).json({
        success:true,
        "message":"REGISTRED SUCCEFULLY",
        user
    })
}


const getAllUser=async(req,res,next)=>{
    try{
        const user = await User.find().select('-password');

        if(!user){
            return next(new AppError("User not Found",404))
        }

        res.status(200).json({
            success:true,
            message:"User reterive Succesfully",
            data:user
        })
    }catch(error){
        return next(new AppError(error.message,500))
    }
  
}


const login = async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        console.log(req.body);
        
        if (!userName || !password) {
            return next(new AppError('All fields are required', 400));
        }

        const user = await User.findOne({ userName }).select('+password');

        if (!user) {
            return next(new AppError('Email or Password not matched', 400));
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new AppError('Email or Password not matched', 400));
        }

        const token = await user.generateJWTToken();

        // Remove sensitive information from user object
        user.password = undefined;

        // Set cookie with the token
        res.cookie('token', token, {
            httpOnly: true,
            // secure: true, // Enable for HTTPS only
            maxAge: 3600000, // Example: cookie expires in 1 hour (in milliseconds)
            sameSite: 'strict' // Recommended to prevent CSRF
        });

        // Debugging: Log parsed cookies from the request
        console.log("cokkie is",req.cookies);

        res.status(200).json({
            success: true,
            message: 'Login Successfully',
            data: user
        });
    } catch (error) {
        return next(new AppError('Bad request', 500));
    }
}


const logout=async(req,res,next)=>{
try{ 

        res.cookie('token',null,{
            secure:true,
            maxAge:0,
            httpOnly:true
        })
    
        res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    }catch(error){
    return next(new AppError(error.message,500))
}
}





export {
    register,
    login,
    getAllUser,
    logout
}