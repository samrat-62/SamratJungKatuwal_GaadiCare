import multer from "multer";
import path from "path";
import fs from "fs";

const checkChatFile = (req, file, cb) => {
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files and PDF documents are allowed in chat"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const folderPath = "./Upload/chatFiles";

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const dest = path.resolve(folderPath);
      cb(null, dest);
    } catch (error) {
      cb(error);
    }
  },

  filename: (req, file, cb) => {
    const date = new Date().toISOString().split("T")[0];
    const cleanName = file.originalname.replace(/\s+/g, "-");
    const finalName = `${date}-${cleanName}`;
    cb(null, finalName);
  },
});

const uploadChatFile = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: checkChatFile,
});

export default uploadChatFile;
