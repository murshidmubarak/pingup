// server/utils/multerConfig.js
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join("tmp/uploads");

// ✅ Ensure folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Disk storage for chunk upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname + "-" + Date.now());
  },
});

const uploadChunks = multer({ storage });

export default uploadChunks;
