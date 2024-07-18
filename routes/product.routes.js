import { Router } from "express";
import upload from '../middleware/multer.middleware.js'
import { addProduct, deleteProduct, editProduct, getProduct, getSingleProduct } from '../controller/Product.controller.js'


const productRoute=Router()


productRoute.post("/",upload.single("productPhoto"),addProduct)
productRoute.get("/",getProduct)
productRoute.get("/Single/:basic_info_id",getSingleProduct)
productRoute.put("/",upload.single("productPhoto"),editProduct)
productRoute.put("/changeStatus",deleteProduct)




export default productRoute