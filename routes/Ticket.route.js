import { Router } from "express";
import {
  addTicket,
  AllClosedTicket,
  AllOpenTicket,
  AllProcessingTicket,
  closeTicket,
  replyTicket,
  singleViewTicket,
} from "../controller/TicketController.js";
import upload from "../middleware/multer.middleware.js";

const TicketRouter = Router();

TicketRouter.post("/", upload.single("screenShot"), addTicket);
TicketRouter.get("/openTicket", AllOpenTicket);
TicketRouter.get("/closedTicket", AllClosedTicket);
TicketRouter.get("/processingTicket", AllProcessingTicket);
TicketRouter.post("/ticketReply", upload.single("photo"), replyTicket);
TicketRouter.post("/closedTicket", closeTicket);
TicketRouter.get("/viewMessage", singleViewTicket);

export default TicketRouter;
