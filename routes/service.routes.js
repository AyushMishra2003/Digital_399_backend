import { Router } from "express";
import upload from '../middleware/multer.middleware.js'
import { addService, getAllService, getService } from "../controller/ServiceController.js";
import { addProduct } from "../controller/Product.controller.js";



const serviceRoute=Router()

serviceRoute.post("/",upload.single("servicePhoto"),addService)
serviceRoute.get("/",getAllService)
serviceRoute.get("/:id",getService)



export default serviceRoute