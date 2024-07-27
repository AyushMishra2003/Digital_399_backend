import multer from "multer";
import path from "path";
import mime from "mime-types";

// Multer configuration for storing files
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/"); // Destination folder where uploaded files will be stored
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname); // Keep original file name
  },
});

// File filter for Multer to accept various file types
const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = mime.lookup(file.originalname); // Get MIME type

  // console.log('File:', file.originalname);
  // console.log('Extension:', ext);
  // console.log('MIME Type:', mimeType);

  if (
    ext !== ".xlsx" &&
    ext !== ".xls" &&
    ext !== ".jpeg" &&
    ext !== ".jpg" &&
    ext !== ".png" &&
    ext !== ".pdf" &&
    ext !== ".txt" &&
    ext !== ".doc" &&
    ext !== ".docx" &&
    mimeType !== "application/pdf" &&
    mimeType !== "application/msword" &&
    mimeType !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
    mimeType !== "application/zip"
  ) {
    return cb(
      new Error(
        "Only Excel, JPEG, JPG, PNG, PDF, DOC, DOCX, and ZIP files are allowed"
      )
    );
  }
  cb(null, true);
};

// Initialize Multer instance with storage and fileFilter
const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
