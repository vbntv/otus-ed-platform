import mongoose from "mongoose";

const Schema = mongoose.Schema;

const videoSchema = new mongoose.Schema({
    name: {type: String, required: true},
    path: {type: String, required: true},
    owner: {
        type: Schema.Types.ObjectId,
        ref: "lesson"
    },
});

const Video = mongoose.model("video", videoSchema);

export {Video}