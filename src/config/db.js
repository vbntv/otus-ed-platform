import mongoose from 'mongoose';
import {ApiException} from "../utils/ApiException.js";

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOSTNAME,
  MONGO_PORT,
  MONGO_DB,
} = process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const options = {
  useNewUrlParser: true,
  reconnectTries: 20,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
};

const connectDb = async function() {
  try {
    await mongoose.connect(url, options);
    console.log('MongoDB connected');
  } catch (e) {
    throw ApiException(500, 'Service unavailable.')
  }
};

export {connectDb};
