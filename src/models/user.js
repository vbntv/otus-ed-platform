import mongoose from "mongoose";
import bcrypt from "bcrypt"

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    ownCourses: [{
        type: Schema.Types.ObjectId,
        ref: "course"
    }],
    courses: [{
        type: Schema.Types.ObjectId,
        ref: "course"
    }],
});

userSchema.pre(
    'save',
    async function (next) {
        this.password = await bcrypt.hash(this.password, 12);
        next();
    }
);

userSchema.methods.isValidPassword = async function (password) {
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model("user", userSchema);

export {User}