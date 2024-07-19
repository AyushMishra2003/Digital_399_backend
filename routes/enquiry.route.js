import { Router } from "express";
import {
  addEnquiry,
  deleteEnquiry,
  getEnquiry,
  getSingleEnquiry,
  restoreEnquiry,
} from "../controller/enquiryController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const enquiryRouter = Router();

enquiryRouter.post("/", isLoggedIn, addEnquiry);
enquiryRouter.get("/", isLoggedIn, getEnquiry);
enquiryRouter.get("/single", isLoggedIn, getSingleEnquiry);
enquiryRouter.delete("/", isLoggedIn, deleteEnquiry);
enquiryRouter.post("/restore", isLoggedIn, restoreEnquiry);

export default enquiryRouter;
