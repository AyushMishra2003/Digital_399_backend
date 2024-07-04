import { Router } from "express";
import upload from '../middleware/multer.middleware.js'
import { addProduct, deleteProduct, editProduct, getProduct } from '../controller/Product.controller.js'


const productRoute=Router()


productRoute.post("/",upload.single("productPhoto"),addProduct)
productRoute.get("/",getProduct)
productRoute.put("/:id",upload.single("productPhoto"),editProduct)
productRoute.delete("/:id",deleteProduct)




export default productRoute