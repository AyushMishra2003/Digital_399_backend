import { Router } from "express";
import {
  addTicket,
  AllClosedTicket,
  AllOpenTicket,
  AllProcessingTicket,
  closeTicket,
  getAllTicket,
  replyTicket,
  singleViewTicket,
} from "../controller/TicketController.js";
import upload from "../middleware/multer.middleware.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";
const TicketRouter = Router();

TicketRouter.post("/", upload.single("screenShot"), addTicket);
TicketRouter.get("/openTicket", isLoggedIn, AllOpenTicket);
TicketRouter.get("/closedTicket", AllClosedTicket);
TicketRouter.get("/processingTicket", isLoggedIn, AllProcessingTicket);
TicketRouter.post("/ticketReply", upload.single("photo"), replyTicket);
TicketRouter.post("/closedTicket", closeTicket);
TicketRouter.get("/:id", singleViewTicket);
TicketRouter.get("/", getAllTicket);

export default TicketRouter;
