import {ApiException} from "../utils/ApiException.js";

const errorHandler = (err, req, res, next) => {
    let {statusCode, message} = err;

    if (!(err instanceof ApiException)) {
         statusCode =
            statusCode || err.name === "MongoError" ? 400 : 500;
         message = err.message || 'Service unavailable';
    }

    res.status(statusCode).send({code: statusCode, message});
}

export {errorHandler};