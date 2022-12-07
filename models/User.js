import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: String,
    photo: String,
    cookie: String,
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

export default mongoose.model("User", UserSchema);