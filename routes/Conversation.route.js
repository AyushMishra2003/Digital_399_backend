import { Router } from "express";
import { getCovMessage, getMessage, sendCovMessage, sendMessage } from "../controller/MessageController.js";


const conversationRoute=Router()

conversationRoute.post("/",sendMessage)
conversationRoute.get("/:id",getMessage)
conversationRoute.post("/conversation",sendCovMessage)
conversationRoute.get("/conversation/:conversationId",getCovMessage)


export default conversationRoute