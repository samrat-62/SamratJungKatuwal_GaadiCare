import multer from "multer";

const storage = multer.memoryStorage();

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

const uploadChatFile = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: checkChatFile,
});

export default uploadChatFile;