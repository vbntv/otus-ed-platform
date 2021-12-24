import express from "express";
import {Lesson} from "../models/lesson.js"
import {Video} from "../models/video.js";
import * as auth from "../middlewares/authorization.js";
import {ApiException} from "../utils/ApiException.js";
import {asyncErrorHandler} from "../middlewares/asyncErrorHandler.js";

const lessonsRouter = express.Router({mergeParams: true});

lessonsRouter.route('/').post(auth.isCourseOwner, asyncErrorHandler(async (req, res) => {
    if (!req.isCourseOwner) {
        throw new ApiException(403, 'You cannot create a lesson in this course.');
    }

    const video = await Video.findById(req.body.videoId).exec();
    const lesson = await Lesson.create({...req.body, ...{owner: req.course._id}});

    video.owner = lesson._id;
    await video.save();

    req.course.lessons.push(lesson);
    await req.course.save();

    res.send(lesson);
}));

lessonsRouter.route('/:lessonName').get(auth.isCourseOwner, auth.isCourseStudent, asyncErrorHandler(async (req, res) => {
    if (!req.isCourseOwner && !req.isCourseStudent) {
        throw new ApiException(403, 'You cannot view this lesson.');
    }

    const course = await req.course.populate({path: 'lessons', match: {name: req.params.lessonName}, justOne: true}).execPopulate();
    if (!course.lessons) {
        throw new ApiException(404, 'Lesson not found');
    }

    res.send(course.lessons);
}));

export {lessonsRouter}
