import express from "express";

const coursesRouter = express.Router();
import {Course} from "../models/course.js"
import {isCourseOwner} from "../middlewares/authorization.js";
import {asyncErrorHandler} from "../middlewares/asyncErrorHandler.js";
import {ApiException} from "../utils/ApiException.js";


coursesRouter.route('/').post(asyncErrorHandler(async (req,res) => {
    const user = req.user;
    const course = new Course(req.body);
    course.author = user._id;
    await course.save();
    user.ownCourses.push(course);
    await user.save();
    res.send(course);
}));

coursesRouter.route('/').get(asyncErrorHandler(async (req,res,next) => {
    const courses = await Course.find();
    res.send(courses);
}));

coursesRouter.route('/:courseName').get(asyncErrorHandler(async (req,res, next) => {
     const course = await Course
        .findOne({name: req.params.courseName})
        .populate('lessons', ['name', 'description'])
        .populate('author', ['name', 'email'])
        .exec();

    res.send(course);
}));

coursesRouter.route('/:courseName').put(isCourseOwner, asyncErrorHandler(async (req, res, next) => {
    const { isCourseOwner, course, body } = req;

    if (!isCourseOwner) {
        throw new ApiException(403, 'You cannot edit this course.');
    }

    await course.updateOne(body);
    res.send(course);
}));

export {coursesRouter}
