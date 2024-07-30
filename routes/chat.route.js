// routes/upload.route.js
import express from "express";
import { upload, uploadToCloudinary } from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload file to Cloudinary
    const result = await uploadToCloudinary(req.file);

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: result.secure_url,
      fileType: result.resource_type,
      fileName: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading file", error });
  }
});

export default router;
