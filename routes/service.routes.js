import { Router } from "express";
import upload from '../middleware/multer.middleware.js'
import { addService } from "../controller/ServiceController.js";



const serviceRoute=Router()

serviceRoute.post("/",upload.single("servicePhoto"),addService)



export default serviceRoute