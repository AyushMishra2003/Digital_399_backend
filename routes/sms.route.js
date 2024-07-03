import { Router } from "express";
import { getAllSendingSms, getAllSmsUser, registrationSms, sendingSms } from "../controller/Sms.controller.js";


const smsRouter=Router()



smsRouter.post("/",registrationSms)
smsRouter.get("/",getAllSmsUser)
smsRouter.post("/smsSend",sendingSms)
smsRouter.get("/smsSend",getAllSendingSms)
export default smsRouter



