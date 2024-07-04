import {Router} from 'express'
import { getAllUser, login, logout, register } from '../controller/User.controller.js'
import { isLoggedIn } from '../middleware/authMiddleware.js'


const userRoute=Router()


userRoute.post("/",register)
userRoute.post("/login",login)
userRoute.get("/",getAllUser)
userRoute.get("/logout",logout)



export default userRoute