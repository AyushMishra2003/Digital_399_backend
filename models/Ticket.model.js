import { model, Schema } from "mongoose";
import BasicInfo from "./Basicinfo.model.js";

const ticketSchema = new Schema(
  {
    purpose: {
      type: Number,
      default: 0,
      enum: [0, 1],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    screenShot: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    basic_info_id: {
      type: Schema.Types.ObjectId,
      ref: "BasicInfo",
    },
    processingLevel: {
      type: String,
      enum: ["Open", "Closed", "Processing"],
      default: "Open",
    },
    replyMessage: [
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
        replyBy: {
          type: Number,
          enum: [1, 0],
        },
        ticket_Id: {
          type: Schema.Types.ObjectId,
          ref: "Ticket",
        },
        replyId: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Ticket = model("Ticket", ticketSchema);

export default Ticket;
