import express from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/user.js"
import {asyncErrorHandler} from "../middlewares/asyncErrorHandler.js";
import {ApiException} from "../utils/ApiException.js";
import {config} from "../config/config.js";

const usersRouter = express.Router();

usersRouter.route('/').post(asyncErrorHandler(async (req, res) => {
    const user = await User.create(req.body);
    res.send({email: user.email, name: user.name});
}));

usersRouter.route('/login').post(asyncErrorHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).exec();

    if (!await user.isValidPassword(password)) {
        throw new ApiException('401', 'Invalid password');
    }

    const token = jwt.sign({id: user.id}, config.secretKey);
    res.send({token: token})
}));


export {usersRouter}
