import express from "express";
import fs from "fs"
import {videoUpload} from "../middlewares/media.js";
import {Video} from "../models/video.js"
import {asyncErrorHandler} from "../middlewares/asyncErrorHandler.js";
import * as auth from "../middlewares/authorization.js";
import {ApiException} from "../utils/ApiException.js";

const videosRouter = express.Router({mergeParams: true});

videosRouter.post('/', videoUpload.single('video'), asyncErrorHandler(async (req, res) => {
    res.send(await Video.create({path: req.file.path, name: req.body.name}));
}));

videosRouter.route('/:videoId').get(auth.isCourseOwner, auth.isCourseStudent, asyncErrorHandler(async (req, res) => {
    if (!req.isCourseOwner && !req.isCourseStudent) {
        throw new ApiException(403, 'You cannot view video from this lesson.');
    }
    const video = await Video.findOne({_id: req.params.videoId});
    const fileSize = fs.statSync(video.path).size;
    const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
}));

export {videosRouter}
