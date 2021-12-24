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

    const course = await req.course.populate({
        path: 'lessons',
        math: {name: req.params.lessonName},
        justOne: true,
        populate: {
            path: 'comments',
            select: ['text'],
            populate: {
                path: 'author',
                select: ['_id', 'name']
            }
        },
    }).execPopulate();

    if (!course.lessons) {
        throw new ApiException(404, 'Lesson not found');
    }

    res.send(course.lessons.comments);
}));

commentsRouter.route('/').post(auth.isCourseOwner, auth.isCourseStudent, asyncErrorHandler(async (req, res) => {
    if (!req.isCourseOwner && !req.isCourseStudent) {
        throw new ApiException(403, 'You cannot leave comments for this lesson.');
    }

    const course = await req.course.populate({
        path: 'lessons',
        match: {name: req.params.lessonName},
        justOne: true
    }).execPopulate();

    if (!course.lessons) {
        throw new ApiException(404, 'Lesson not found');
    }

    const comment = await Comment.create({...req.body, ...{author: req.user._id}});

    course.lessons.comments.push(comment);
    await course.lessons.save()

    res.send(comment);
}));

export {commentsRouter}
