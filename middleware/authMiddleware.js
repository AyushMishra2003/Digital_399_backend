import AppError from '../utlis/error.utlis.js';
import jwt from 'jsonwebtoken'

const isLoggedIn = async (req, res, next) => {
    try {   
         
        console.log("cokkie ayush");
        console.log(req.cookies); 
        const token = req.cookies.token; 
 
        if (!token) {
            return next(new AppError("Not LOG In,please login first"))
        }
 
        const userDetails = await jwt.verify(token, process.env.SECRET);
 
        req.user = userDetails;
 
        next();
    } catch (error) {
        console.error(error); // Log the error for debugging
        return next(new AppError("Unauthorized", 401));
    }
 };
 


export {
    isLoggedIn
}