import pkg from "mongoose";
import multer from "multer";
import { extname } from "path"; // Correct the import for extname

const { Path } = pkg;

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "C:/Users/Pinky Pamecha/OneDrive/Desktop/qoura unicode/alluploads/profilePics");
    },
    filename: function(req, file, cb) {
        let ext = extname(file.originalname); // Use extname to get the file extension
        cb(null, ext);
    }
});

var upload = multer({
    storage: storage,
     fileFilter: function(req, file, callback) {
         if (
             file.mimetype === "image/png" || // Correct mimetype strings
             file.mimetype === "image/jpeg" // Correct mimetype strings
             
         ) {
             callback(null, true);
         } else {
             console.log('Only jpg/png files supported!');
             callback(null, false);
         }
     },
     limits: {
         fileSize: 1024 * 1024 * 2
     }
});

export { upload };
