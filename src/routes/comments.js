import express from "express";
import * as auth from "../middlewares/authorization.js";
import {asyncErrorHandler} from "../middlewares/asyncErrorHandler.js";
import {Comment} from "../models/comment.js";
import {ApiException} from "../utils/ApiException.js";

const commentsRouter = express.Router({mergeParams: true});

commentsRouter.route('/').get(auth.isCourseOwner, auth.isCourseStudent, asyncErrorHandler(async (req, res) => {
    if (!req.isCourseOwner && !req.isCourseStudent) {
        throw new ApiException(403, 'You cannot view comments for this lesson.');
    }

    const comments = await Comment.find();
    res.send(comments);
}));

commentsRouter.route('/').post(auth.isCourseOwner, auth.isCourseStudent, asyncErrorHandler(async (req, res) => {
    if (!req.isCourseOwner && !req.isCourseStudent) {
        throw new ApiException(403, 'You cannot leave comments for this lesson.');
    }

    const course = await req.course.populate({path: 'lessons', match: {name: req.params.lessonName}}).execPopulate();
    const comment = new Comment(req.body);
    comment.author = req.user._id;
    await comment.save();
    course.lessons[0].comments.push(comment);
    await course.lessons[0].save()
    res.send(comment);
}));

export {commentsRouter}
