import express from "express";
import morgan from "morgan";
import rfs from "rotating-file-stream";
import path from "path";
import bodyParser from "body-parser";
import {connectDb} from "./config/db.js";
import {User} from "./models/user.js";
import {router} from "./routes/index.js"
import passport from "passport";
import {Strategy} from "passport-jwt";
import {ExtractJwt} from "passport-jwt";
import {errorHandler} from "./middlewares/errorHandler.js";
import {config} from "./config/config.js";
import {asyncErrorHandler} from "./middlewares/asyncErrorHandler.js";
import {ApiException} from "./utils/ApiException.js";

const app = express();

let options = {
    secretOrKey: config.secretKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new Strategy(options, asyncErrorHandler(async (payload, next) => {
    const user = await User.findOne({_id: payload.id});
    if (!user) {
        throw new ApiException(404, 'User not found');
    }
    return next(null, user);
})));

let logStream = rfs.createStream('app.log', {
    interval: '1d',
    path: path.join('runtime', config.logDir)
});

await connectDb();

app.use(passport.initialize());

app.use(morgan('common', {stream: logStream}));

app.use(bodyParser.json());

app.use('/api', router);

app.use(errorHandler);

app.listen(config.appPort, () => console.log('Server started on ' + config.appPort))
