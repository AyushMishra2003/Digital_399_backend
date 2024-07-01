import { Router } from "express";
import { addBasicInfo } from "../controller/BasicController.js";
import upload from '../middleware/multer.middleware.js'

const basicRoute=Router()

basicRoute.post("/",upload.single("companyLogo"),addBasicInfo)



export default basicRoute 