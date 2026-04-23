import multer from "multer";

const storage = multer.memoryStorage();

const checkImage = (req, file, cb) => {
  const allowedImageTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images allowed!"), false);
  }
};

const uploadWorkshopImg = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: checkImage,
});

export default uploadWorkshopImg;