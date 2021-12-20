import express from "express";
import fs from "fs"
import {videoUpload} from "../middlewares/media.js";

const videosRouter = express.Router({mergeParams: true});
import {Video} from "../models/video.js"

videosRouter.post('/', videoUpload.single('video'), (req, res) => {
    const video = new Video();
    video.path = req.file.path;
    video.name = req.body.name;
    video.save().then(video => res.send(video));
})

videosRouter.route('/:videoId').get( async (req,res,next) => {
    const path = 'uploads/videos/Node_2021_06_REST_API_с_MongoDB-8966-fb416a.mp4';
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize-1
        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});


export {videosRouter}
