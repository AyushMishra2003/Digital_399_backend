import { Router } from "express";
import upload from '../middleware/multer.middleware.js'
import { addProduct, deleteProduct, editProduct, getProduct, getSingleProduct } from '../controller/Product.controller.js'
import { isLoggedIn } from "../middleware/authMiddleware.js";

const productRoute=Router()


productRoute.post("/",isLoggedIn,upload.single("productPhoto"),addProduct)
productRoute.get("/",isLoggedIn,getProduct)
productRoute.get("/Single/:basic_info_id",isLoggedIn,getSingleProduct)
productRoute.put("/",upload.single("productPhoto"),isLoggedIn,editProduct)
productRoute.put("/changeStatus",isLoggedIn,deleteProduct)




export default productRoute