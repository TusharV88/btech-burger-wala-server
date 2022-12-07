import User from "../models/User.js";
import ErrorHandler from "../utils/ErrorHandler.js";


export const isAuthenticated = async (req, res, next) => {
    // console.log("Request Auth: " + req.user);
    var token = "null";
    if (req.user !== undefined) {
        const user = await User.findById(req.user._id);
        token = user.cookie;
        // console.log("Auth Token: " + token);
    }
    if (token === "null") {
        return next(new ErrorHandler("Not Logged In", 401));
    }
    next();
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorHandler("Only Admin Allowed", 405));
    }
    next();
};
