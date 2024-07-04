import AppError from '../utlis/error.utlis.js';
import jwt from 'jsonwebtoken'

const isLoggedIn = async (req, res, next) => {
    try {   
         
        console.log("cokkie ayush");
        console.log(req.cookies); // Make sure cookies are accessible
        const token = req.cookies.token; // Corrected token extraction
 
        console.log(token); // Debugging token retrieval
 
        if (token) {
            return next(new AppError("Already Loggied In"))
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