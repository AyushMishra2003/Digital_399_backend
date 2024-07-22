import { model, Schema } from "mongoose";
import Ticket from "./Ticket.model.js";

const ticket_Reply_Schema = new Schema(
  {
    message: {
      type: String,
    },
    photo: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    by: {
      type: String,
      enum: ["ADMIN", "Customer"],
    },
    reply_time: {
      type: Date,
    },
    ticket_Id: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
    messageTime: {
      type: String,
    },
  },
  {}
);

const TicketReply = model("TicketReply", ticket_Reply_Schema);

export default TicketReply;
