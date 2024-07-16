import { Router } from "express";
import { addCoupon, applyCoupon, deleteCoupon, getCoupon, updateCoupon } from "../controller/CouponController.js";



const couponRouter=Router()

couponRouter.post("/",addCoupon)

couponRouter.get("/",getCoupon)
couponRouter.post("/applyCoupon",applyCoupon)
couponRouter.put("/:id",updateCoupon)
couponRouter.delete("/:id",deleteCoupon)

export default couponRouter