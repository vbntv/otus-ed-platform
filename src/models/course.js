import  mongoose  from "mongoose";
const Schema = mongoose.Schema;

const courseSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: true},
    author: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    lessons: [{
        type: Schema.Types.ObjectId,
        ref: "lesson"
    }],
    students: [ {
        type: Schema.Types.ObjectId,
        ref: "user"
    }]
});

courseSchema.methods.isValidPassword = async function(password) {
    const user = this;
    return user.password === password;
}

const Course = mongoose.model("course", courseSchema);

export { Course }