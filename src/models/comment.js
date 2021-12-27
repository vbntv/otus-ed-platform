import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
});

const Comment = mongoose.model("comment", commentSchema);

export {Comment}