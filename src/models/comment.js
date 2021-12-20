import  mongoose  from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author: {
        type: Schema.Types.ObjectId,
        ref: "user"
    }
});

commentSchema.methods.isValidPassword = async function(password) {
    const comment = this;
    return comment.password === password;
}

const Comment = mongoose.model("comment", commentSchema);

export { Comment }