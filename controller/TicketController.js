import BasicInfo from "../models/Basicinfo.model.js";
import Ticket from "../models/Ticket.model.js";
import AppError from "../utlis/error.utlis.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import { rmSync } from "fs";
import TicketReply from "../models/Ticket_Reply.model.js";

const addTicket = async (req, res, next) => {
  try {
    const { purpose, message, basic_info_id, processingLevel } = req.body;

    console.log(req.body);

    const validCustomer = await BasicInfo.findById(basic_info_id);

    if (!validCustomer) {
      return next(new AppError("Customer is Not Valid", 400));
    }

    const ticket = await Ticket.create({
      purpose,
      message,
      basic_info_id,
    });

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      if (result) {
        (ticket.screenShot.public_id = result.public_id),
          (ticket.screenShot.secure_url = result.secure_url);
      }
      fs.rm(`uploads/${req.file.filename}`);
    }

    if (!ticket) {
      return next(new AppError("Ticket is Not Valid", 400));
    }
    if (processingLevel) {
      console.log("hlo processing level");
      ticket.processingLevel = processingLevel;
      console.log(ticket);
    }

    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Ticket Added Succesfully",
      data: ticket,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const AllOpenTicket = async (req, res, next) => {
  try {
    const { basic_info_id } = req.body;

    console.log(req.body);

    const validCustomer = await BasicInfo.findById(basic_info_id);

    console.log(validCustomer);

    if (!validCustomer) {
      return next(new AppError("Customer is not Valid", 400));
    }
    const processingLevel = "Open";

    const ticket = await Ticket.find({ basic_info_id, processingLevel });

    console.log(ticket);

    if (!ticket) {
      return next(new AppError("Ticket Not Found", 400));
    }

    res.status(200).json({
      success: true,
      message: "All Open Ticket are:-",
      data: ticket,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const AllClosedTicket = async (req, res, next) => {
  try {
    const { basic_info_id } = req.body;

    const validCustomer = await BasicInfo.findById(basic_info_id);

    if (!validCustomer) {
      return next(new AppError("Customer is not Valid", 400));
    }
    const processingLevel = "Closed";

    const ticket = await Ticket.find({ basic_info_id, processingLevel });

    if (!ticket) {
      return next(new AppError("Ticket Not Found", 400));
    }

    res.status(200).json({
      success: true,
      message: "All Closed Ticket are:-",
      data: ticket,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const AllProcessingTicket = async (req, res, next) => {
  try {
    const { basic_info_id } = req.body;

    const validCustomer = await BasicInfo.findById(basic_info_id);

    if (!validCustomer) {
      return next(new AppError("Customer is not Valid", 400));
    }
    const processingLevel = "Processing";

    const ticket = await Ticket.find({ basic_info_id, processingLevel });

    console.log(ticket);

    if (!ticket) {
      return next(new AppError("Ticket Not Found", 400));
    }

    res.status(200).json({
      success: true,
      message: "All Processing Ticket are:-",
      data: ticket,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const replyTicket = async (req, res, next) => {
  try {
    const { ticket_Id, message, replyBy } = req.body;

    const validTicket = await Ticket.findById(ticket_Id);

    if (!validTicket) {
      return next(new AppError("Ticket is Not Valid", 400));
    }

    if (validTicket.processingLevel === "Closed") {
      return next(
        new AppError("Ticket is Already Solved,raised new Ticket", 400)
      );
    }

    const by = parseInt(replyBy) === 1 ? "ADMIN" : "Customer";
    const currentDate = new Date();
    const replyId =
      currentDate.toISOString().slice(2, 4) + // Year (last two digits)
      currentDate.toISOString().slice(5, 7) + // Month
      currentDate.toISOString().slice(8, 10) + // Day
      currentDate.toISOString().slice(11, 13) + // Hours
      currentDate.toISOString().slice(14, 16) + // Minutes
      currentDate.toISOString().slice(17, 19); // Seconds

    const ticketReply = {
      ticket_Id,
      message,
      by,
      replyId,
      photo: {
        public_id: "",
        secure_url: "",
      },
    };

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms",
      });
      if (result) {
        (ticketReply.photo.public_id = result.public_id),
          (ticketReply.photo.secure_url = result.secure_url);
      }
      fs.rm(`uploads/${req.file.filename}`);
    }

    validTicket.replyMessage.push(ticketReply);
    validTicket.processingLevel = "Processing";

    await validTicket.save();

    res.status(200).json({
      success: true,
      message: "Reply Sent Succesfully",
      data: ticketReply,
    });
  } catch (error) {
    return next(error.message, 500);
  }
};

const closeTicket = async (req, res, next) => {
  try {
    const { id, ticketId } = req.body;

    const validBasic = await BasicInfo.findById(id);

    if (!validBasic) {
      return next(new AppError("Not found", 400));
    }

    const validTicket = await Ticket.findById(ticketId);

    if (!validTicket) {
      return next(new AppError("Ticket is Not found", 400));
    }

    if (validTicket.processingLevel === "Closed") {
      return next(new AppError("Ticket is Already Closed", 400));
    }

    validTicket.processingLevel = "Closed";

    await validTicket.save();

    res.status(200).json({
      success: true,
      message: "Ticket Solved Succesfully",
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const singleViewTicket = async (req, res, next) => {
  try {
    const { basic_info_id } = req.body;

    const validBasic = await BasicInfo.findById(basic_info_id);

    if (!validBasic) {
      return next(new AppError("Customer is Not Valid", 400));
    }

    const validTicket = await Ticket.findOne({ basic_info_id });

    if (!validTicket) {
      return next(new AppError("Ticket is not Valid", 400));
    }
    console.log(validTicket.replyMessage);

    res.status(200).json({
      success: true,
      message: "All Reply Message Are",
      data: validTicket.replyMessage,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export {
  addTicket,
  AllOpenTicket,
  AllClosedTicket,
  AllProcessingTicket,
  replyTicket,
  closeTicket,
  singleViewTicket,
};
