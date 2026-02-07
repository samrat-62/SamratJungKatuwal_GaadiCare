import multer from "multer";
import path from "path";
import fs from "fs";

const checkImage = (req, file, cb) => {
  const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images allowed!"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const folderPath = "./Upload/workshopImage";

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

const uploadWorkshopImg = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: checkImage,
});

export default uploadWorkshopImg;
