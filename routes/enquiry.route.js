import { Router } from "express";
import {
  addEnquiry,
  deleteEnquiry,
  getEnquiry,
  getSingleEnquiry,
  getTrashEnquiry,
  restoreEnquiry,
} from "../controller/enquiryController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const enquiryRouter = Router();

enquiryRouter.post("/", isLoggedIn, addEnquiry);
enquiryRouter.get("/", isLoggedIn, getEnquiry);
enquiryRouter.get("/single", isLoggedIn, getSingleEnquiry);
enquiryRouter.delete("/", isLoggedIn, deleteEnquiry);
enquiryRouter.post("/restore", isLoggedIn, restoreEnquiry);
enquiryRouter.get("/trash", isLoggedIn, getTrashEnquiry);

export default enquiryRouter;
