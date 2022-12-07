import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: String,
    photo: String,
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

export default mongoose.model("User", UserSchema);