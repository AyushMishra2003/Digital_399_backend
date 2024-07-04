import { Router } from "express";
import upload from '../middleware/multer.middleware.js'
import { addService, deleteService, getAllService, getService, updateService } from "../controller/ServiceController.js";




const serviceRoute=Router()

serviceRoute.post("/",upload.single("servicePhoto"),addService)
serviceRoute.get("/",getAllService)
serviceRoute.get("/:id",getService)
serviceRoute.put("/:id",upload.single("servicePhoto"),updateService)
serviceRoute.delete("/:id",deleteService)


export default serviceRoute