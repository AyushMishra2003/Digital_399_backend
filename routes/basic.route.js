import { Router } from "express";
import {
  addBasicInfo,
  addCode,
  deleteBasicInfo,
  getAllBasicInfo,
  getBasicInfo,
  isActive,
  updateBasicInfo,
} from "../controller/BasicController.js";
import { upload } from "../middleware/multer.middleware.js";
import { isLoggedIn } from "../middleware/authMiddleware.js";

const basicRoute = Router();

basicRoute.post("/", upload.single("companyLogo"), addBasicInfo);
basicRoute.get("/", getAllBasicInfo);
basicRoute.get("/:id", getBasicInfo);
basicRoute.put("/:id", upload.single("companyLogo"), updateBasicInfo);
basicRoute.delete("/:id", deleteBasicInfo);
basicRoute.put("/active/:id", isActive);
basicRoute.post("/check", addCode);

export default basicRoute;
