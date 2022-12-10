import ErrorHandler from "../utils/ErrorHandler.js";

export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies["connect.sid"];
    console.log("Auth Token: " + token);
    if (!token) {
        console.log("Not Logged In");
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
