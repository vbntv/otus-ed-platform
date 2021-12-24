import express from "express";
import {Course} from "../models/course.js"
import {isCourseOwner} from "../middlewares/authorization.js";
import {asyncErrorHandler} from "../middlewares/asyncErrorHandler.js";
import {ApiException} from "../utils/ApiException.js";

const coursesRouter = express.Router();

coursesRouter.route('/').post(asyncErrorHandler(async (req,res) => {
    const user = req.user;
    const course = await Course.create({...req.body, ...{author: req.user._id}});

    user.ownCourses.push(course);
    await user.save();

    res.send(course);
}));

coursesRouter.route('/').get(asyncErrorHandler(async (req,res) => {
    const courses = await Course.find();
    res.send(courses);
}));

coursesRouter.route('/:courseName').get(asyncErrorHandler(async (req,res) => {
     const course = await Course
        .findOne({name: req.params.courseName})
        .populate('lessons', ['name', 'description'])
        .populate('author', ['name', 'email'])
        .exec();

     if (!course) {
         throw new ApiException(404, 'Course not found');
     }

     res.send(course);
}));

coursesRouter.route('/:courseName').put(isCourseOwner, asyncErrorHandler(async (req, res) => {
    const { isCourseOwner, course, body } = req;

    if (!isCourseOwner) {
        throw new ApiException(403, 'You cannot edit this course.');
    }

    await course.update(body);
    res.send(await Course.findById(course._id));
}));

export {coursesRouter}
