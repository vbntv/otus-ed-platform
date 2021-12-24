import express from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/user.js"

const usersRouter = express.Router();

usersRouter.route('/').post(async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.send({email: user.email, name: user.name});
    } catch (error) {
        next(error);
    }
});

usersRouter.route('/login').post(async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}).exec();
        if (user.isValidPassword(password)) {
            const payload = {id: user.id};
            const token = jwt.sign(payload, process.env.SECRET_KEY);
            res.send({token: token})
        }
    } catch (error) {
        next(error);
    }
});


export {usersRouter}
