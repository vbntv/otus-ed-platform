import multer from "multer";
import path from "path";
import {videoConfig} from "../config/config.js";

const videoStorage = multer.diskStorage({
    destination: videoConfig.uploadPath,
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: videoConfig.maxFileSize
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv|MOV)$/)) {
            return cb(new Error('Please upload a video'));
        }
        cb(null, true);
    }
})

export {videoUpload}