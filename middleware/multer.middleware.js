import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import path from "path";
import mime from "mime-types";

// Multer setup to store files in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = mime.lookup(file.originalname);

    // Allowed file extensions and MIME types
    const allowedExtensions = [
      ".jpeg",
      ".jpg",
      ".png",
      ".pdf",
      ".txt",
      ".doc",
      ".docx",
      ".zip",
    ];
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip",
    ];

    if (
      !allowedExtensions.includes(ext) &&
      !allowedMimeTypes.includes(mimeType)
    ) {
      return cb(
        new Error(
          "Only JPEG, JPG, PNG, PDF, TXT, DOC, DOCX, and ZIP files are allowed"
        )
      );
    }
    cb(null, true);
  },
});

// Function to upload file to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Create a readable stream from the buffer
    const readableStream = new Readable();
    readableStream._read = () => {}; // Implement _read method for the stream

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(file.buffer);

    readableStream.push(buffer);
    readableStream.push(null); // End the stream

    readableStream.pipe(stream);
  });
};

export { upload, uploadToCloudinary };
