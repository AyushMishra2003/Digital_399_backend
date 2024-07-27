import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import morgan from "morgan";
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
import dotenv from "dotenv";
import TicketRouter from "./routes/Ticket.route.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Logging requests to the console

// CORS configuration (for handling cross-origin requests)
app.use((req, res, next) => {
  // Allow any origin when credentials are not present
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials like cookies
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

// Error handling middleware
app.use(errorMiddleware);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Example of handling a custom event
  socket.on("chat-message", (msg) => {
    console.log(`Message received: ${msg}`);
    io.emit("chat message", msg); // Broadcast the message to all connected clients
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running and ready.",
  });
});

// Error handling middleware (must be defined after routes)
// app.use(errorMiddleware);

// Catch-all route for undefined endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: "Oops! Not Found",
  });
});

export { app, server, io };
