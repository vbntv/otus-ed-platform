import {Course} from "../models/course.js";
import {ApiException} from "../utils/ApiException.js";

async function isCourseOwner(req, res, next) {
    const course = await Course.findOne({name: req.params.courseName}).populate('author', ['_id']);
    if (!course) {
        throw new ApiException(404, 'Course not found');
    }
    req.isCourseOwner = String(req.user._id) === String(course.author._id);
    req.course = course;
    next();
}

async function isCourseStudent(req, res, next) {
    const course = req.course ?
        await req.course.populate({
            path: 'students',
            match: {_id: req.user._id}
        }).execPopulate() :
        await Course.findOne({name: req.params.courseName}).populate({
            path: 'students',
            match: {_id: req.user._id}
        });

    if (!course) {
        throw new ApiException(404, 'Course not found');
    }

    res.isCourseStudent = course.students.length > 0;
    req.course = course;
    next();
}

export {isCourseStudent, isCourseOwner}


