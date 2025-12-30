const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// File filter (optional)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const isValid =
//     allowedTypes.test(file.mimetype) &&
//     allowedTypes.test(path.extname(file.originalname).toLowerCase());

//   if (isValid) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only images allowed"));
//   }
// };

const upload = multer({ storage });

module.exports = upload;
