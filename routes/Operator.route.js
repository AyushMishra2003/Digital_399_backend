import { Router } from "express";
import upload from '../middleware/multer.middleware.js'
import { addOperator, getOperator, updateOperator } from "../controller/Operator.controller.js";


const operatorRoute=Router()


operatorRoute.post("/",upload.single('operatorPhoto'),addOperator)
operatorRoute.get("/",getOperator)
operatorRoute.put("/:id",upload.single('operatorPhoto'),updateOperator)


export default operatorRoute