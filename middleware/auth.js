import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies["token"];
    if (!token) {
        return next(new ErrorHandler("Not Logged In", 401));
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);

    next();
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorHandler("Only Admin Allowed", 405));
    }
    next();
};
