import { Router } from "express";
import {
  addFeedBack,
  deleteFeedBack,
  getAllTrashFeedback,
  getFeedBack,
} from "../controller/FeedBack.controller.js";

const feedbackRouter = Router();

feedbackRouter.post("/", addFeedBack);
feedbackRouter.get("/", getFeedBack);
feedbackRouter.delete("/", deleteFeedBack);
feedbackRouter.get("/trash", getAllTrashFeedback);

export default feedbackRouter;
