import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { addUser, getAllUsers } from "../../controller/Test/chatController.js";

// Get the directory name from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Route to add a user with a photo
router.post("/add", upload.single("photo"), addUser);

// Route to get all users
router.get("/", getAllUsers);

export default router;
