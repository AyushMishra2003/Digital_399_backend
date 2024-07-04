import { Router } from "express";
import { addBasicInfo, deleteBasicInfo, getAllBasicInfo, getBasicInfo, updateBasicInfo } from "../controller/BasicController.js";
import upload from '../middleware/multer.middleware.js'

const basicRoute=Router()

basicRoute.post("/",upload.single("companyLogo"),addBasicInfo)
basicRoute.get("/",getAllBasicInfo)
basicRoute.get("/:id",getBasicInfo)
basicRoute.put("/:id",upload.single("companyLogo"),updateBasicInfo)
basicRoute.delete("/",deleteBasicInfo)




export default basicRoute 