import { Router } from "express";
import { addBasicInfo, getAllBasicInfo, getBasicInfo, updateBasicInfo } from "../controller/BasicController.js";
import upload from '../middleware/multer.middleware.js'

const basicRoute=Router()

basicRoute.post("/",upload.single("companyLogo"),addBasicInfo)
basicRoute.get("/",getAllBasicInfo)
basicRoute.get("/:id",getBasicInfo)
basicRoute.put("/:id",upload.single("companyLogo"),updateBasicInfo)




export default basicRoute 