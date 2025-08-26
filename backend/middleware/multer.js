import multer from "multer";

const fileFilter = (req, file, callback) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    callback(null, true);
  } else {
    callback(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export default upload;