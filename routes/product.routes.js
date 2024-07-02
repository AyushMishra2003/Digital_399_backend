import { Router } from "express";
import upload from '../middleware/multer.middleware.js'
import { addProduct, getProduct } from '../controller/Product.controller.js'


const productRoute=Router()


productRoute.post("/",upload.single("productPhoto"),addProduct)
productRoute.get("/",getProduct)




export default productRoute