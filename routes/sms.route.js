import { Router } from "express";
import { getAllSmsUser, registrationSms, sendingSms } from "../controller/Sms.controller.js";


const smsRouter=Router()



smsRouter.post("/",registrationSms)
smsRouter.get("/",getAllSmsUser)
smsRouter.post("/smsSend",sendingSms)
export default smsRouter



