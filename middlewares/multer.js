import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file");

// export const singleUpload = (req, res, next) => {
//   multerUpload(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({
//         success: false,
//         message: "File upload error",
//         error: err.message,
//       });
//     }
//     next();
//   });
// };
