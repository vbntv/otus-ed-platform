import  mongoose  from "mongoose";
const Schema = mongoose.Schema;

const lessonSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    video: {
        type: Schema.Types.ObjectId,
        ref: "video"
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "comment"
    }],
    links: [String],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "course"
    }
});

const Lesson = mongoose.model("lesson", lessonSchema);

export { Lesson }