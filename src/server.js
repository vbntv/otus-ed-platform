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

await connectDb();

const app = express();
const port = process.env.p || 8000;
const dirname = 'logs';

let options = {
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(new Strategy(options, async function (payload, next) {
    try {
        const user = await User.findOne({_id: payload.id});
        if (!user) {
            return next(null, false, {message: 'User not found'});
        }
        return next(null, user);
    } catch (e) {
        throw new Error(e.message)
    }
}));


let logStream = rfs.createStream('app.log', {
    interval: '1d', // rotate daily
    path: path.join('runtime', dirname)
})

app.use(passport.initialize())

app.use(morgan('common', {stream: logStream}));

app.use(bodyParser.json());

app.use('/api', router);

app.use(errorHandler);

app.listen(port, () => console.log('Server started on ' + port))
