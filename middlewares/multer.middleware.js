// import multer from 'multer';
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/temp')
//   },

//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.originalname+ '-' + uniqueSuffix)
//   }
// })

// const upload = multer({ storage: storage })
// export {upload};
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    const ext = path.extname(file.originalname); // .png / .jpg
    const name = path.basename(file.originalname, ext);

    cb(null, name + '-' + uniqueSuffix + ext);  // ✅ correct
  }
});
  
const upload = multer({ storage: storage });
export {upload};
// multer middleware jo file ko local me save karta hai temporary folder me taki hum usse cloudnary pe upload kar sake
//multer ek middleware hai jo multipart/form-data ko handle karta hai jo ki file upload ke liye use hota hai.
