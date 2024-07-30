import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  addService,
  deleteService,
  getAllService,
  getService,
  updateService,
} from "../controller/ServiceController.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const serviceRoute = Router();

serviceRoute.post("/", isLoggedIn, upload.single("servicePhoto"), addService);
serviceRoute.get("/all/:basic_Info_Id", isLoggedIn, getAllService);
serviceRoute.get("/:basic_info_id", isLoggedIn, getService);
serviceRoute.put(
  "/:id",
  isLoggedIn,
  upload.single("servicePhoto"),
  updateService
);
serviceRoute.put("/", isLoggedIn, deleteService);

export default serviceRoute;
