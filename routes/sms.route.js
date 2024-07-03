import { Router } from "express";
import {  deleteSmsUser, getAllFalseSendingSMS, getAllSendingSms, getAllSmsUser, registrationSms, sendingSms, updateSmsUser } from "../controller/Sms.controller.js";


const smsRouter=Router()



smsRouter.post("/",registrationSms)
smsRouter.get("/",getAllSmsUser)
smsRouter.post("/smsSend",sendingSms)
smsRouter.get("/smsSend",getAllSendingSms)
smsRouter.put("/:id",updateSmsUser)
smsRouter.delete("/:id",deleteSmsUser)
smsRouter.get("/notsmsSend",getAllFalseSendingSMS)
export default smsRouter



