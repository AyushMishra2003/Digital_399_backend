import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import basicRoute from "./routes/basic.route.js";
import serviceRoute from "./routes/service.routes.js";
import smsRouter from "./routes/sms.route.js";
import productRoute from "./routes/product.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRoute from "./routes/user.route.js";
import enquiryRouter from "./routes/enquiry.route.js";
import feedbackRouter from "./routes/feedback.route.js";
import conversationRoute from "./routes/Conversation.route.js";
import operatorRoute from "./routes/Operator.route.js";
import couponRouter from "./routes/coupon.routes.js";
import LoginUserrouter from "./routes/userLogin.routes.js";
import TicketRouter from "./routes/Ticket.route.js";
import userroute from "./routes/chatUser.route.js";

// Import models
import User from "./models/Chat_Model/chat.user.model.js";
import Message from "./models/Chat_Model/chat.message.model.js";

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Logging requests to the console

// CORS configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/basicInfo", basicRoute);
app.use("/api/v1/service", serviceRoute);
app.use("/api/v1/sms", smsRouter);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/inquiry", enquiryRouter);
app.use("/api/v1/feedback", feedbackRouter);
app.use("/api/v1/message", conversationRoute);
app.use("/api/v1/operator", operatorRoute);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/userLogin", LoginUserrouter);
app.use("/api/v1/ticket", TicketRouter);
app.use("/api/v1/chat", userroute);

// Error handling middleware
app.use(errorMiddleware);

// Catch-all route for undefined endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: "Oops! Not Found",
  });
});

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("establish_connection", async ({ sender, recipient }) => {
    try {
      console.log(sender, recipient);
      const senderExists = await User.findOne({ username: sender });
      const recipientExists = await User.findOne({ username: recipient });

      console.log(senderExists);
      console.log("recipient", recipientExists);

      if (senderExists && recipientExists) {
        socket.join(sender);
        socket.join(recipient);
        console.log(senderExists, recipientExists);
        console.log("users are connectd burhh!");

        socket.emit("connection_established", {
          success: true,
          message: `Connected to ${recipient}`,
        });

        const messages = await Message.find({
          $or: [
            { sender, recipient },
            { sender: recipient, recipient: sender },
          ],
        }).sort("timestamp");

        socket.emit("message_history", messages);
      } else {
        socket.emit("error", "Sender or recipient does not exist");
      }
    } catch (error) {
      console.error("Error in establishing connection:", error);
      socket.emit("error", "Internal Server Error");
    }
  });

  socket.on("send_message", async ({ sender, recipient, content }) => {
    try {
      const message = new Message({ sender, recipient, content });
      await message.save();

      io.to(sender).emit("receive_message", message);
      io.to(recipient).emit("receive_message", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running and ready.",
  });
});

export { app, server, io };
