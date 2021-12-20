import { usersRouter } from "./user.js";
import { coursesRouter } from "./courses.js";
import { lessonsRouter } from "./lessons.js";
import { commentsRouter } from "./comments.js";
import { videosRouter } from "./videos.js";

import express from "express";
import passport from "passport";
const router = express.Router();

router.use('/users', usersRouter);
router.use('/videos', passport.authenticate('jwt',{session: false}), videosRouter);
router.use('/courses/:courseName/lessons/:lessonName/comments', passport.authenticate('jwt',{session: false}), commentsRouter);
router.use('/courses', passport.authenticate('jwt',{session: false}), coursesRouter);
router.use('/courses/:courseName/lessons', passport.authenticate('jwt',{session: false}), lessonsRouter);

export { router }